import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from main import app
from chess.api.router import get_store
from chess.store.game_store import GameStore


@pytest.fixture
def test_store():
    return GameStore()


@pytest.fixture(autouse=True)
def override_store(test_store):
    app.dependency_overrides[get_store] = lambda: test_store
    yield
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


async def play_moves(client, game_id, moves):
    """Play a sequence of moves and return the final state."""
    resp = None
    for from_sq, to_sq, *rest in moves:
        promotion = rest[0] if rest else None
        body = {"from_sq": from_sq, "to_sq": to_sq}
        if promotion:
            body["promotion"] = promotion
        resp = await client.post(f"/games/{game_id}/moves", json=body)
        assert resp.status_code == 200, f"Move {from_sq}-{to_sq} failed: {resp.text}"
    return resp.json() if resp else None


@pytest.mark.asyncio
async def test_fools_mate(client):
    """1. f3 e5 2. g4 Qh4# — White loses in 2 moves."""
    resp = await client.post("/games")
    game_id = resp.json()["game_id"]

    await play_moves(client, game_id, [
        ("f2", "f3"),
        ("e7", "e5"),
        ("g2", "g4"),
        ("d8", "h4"),
    ])

    state_resp = await client.get(f"/games/{game_id}")
    data = state_resp.json()
    assert data["status"] == "checkmate"
    assert data["turn"] == "white"  # white is the one in checkmate


@pytest.mark.asyncio
async def test_en_passant_sequence(client):
    """White e2-e4, e4-e5; Black d7-d5; White e5xd6 en passant."""
    resp = await client.post("/games")
    game_id = resp.json()["game_id"]

    state = await play_moves(client, game_id, [
        ("e2", "e4"),
        ("a7", "a6"),  # black tempo move
        ("e4", "e5"),
        ("d7", "d5"),
        ("e5", "d6"),  # en passant capture
    ])

    # d5 should now be empty (captured pawn removed)
    board = state["board"]
    d5_row, d5_col = 3, 3  # d5 = row 3 (rank 5), col 3 (file d)
    assert board[d5_row][d5_col] is None


@pytest.mark.asyncio
async def test_kingside_castling(client):
    """White clears path and castles kingside."""
    resp = await client.post("/games")
    game_id = resp.json()["game_id"]

    state = await play_moves(client, game_id, [
        ("e2", "e4"),
        ("e7", "e5"),
        ("f1", "c4"),  # bishop out
        ("d7", "d6"),
        ("g1", "f3"),  # knight out
        ("c8", "d7"),
        ("e1", "g1"),  # castle kingside
    ])

    board = state["board"]
    # King at g1 (row 7, col 6)
    assert board[7][6]["piece_type"] == "king"
    # Rook at f1 (row 7, col 5)
    assert board[7][5]["piece_type"] == "rook"


@pytest.mark.asyncio
async def test_queenside_castling(client):
    """White clears queenside and castles."""
    resp = await client.post("/games")
    game_id = resp.json()["game_id"]

    state = await play_moves(client, game_id, [
        ("d2", "d4"),
        ("d7", "d5"),
        ("c1", "f4"),  # bishop out
        ("c8", "f5"),
        ("b1", "c3"),  # knight out
        ("b8", "c6"),
        ("d1", "d3"),  # queen out
        ("d8", "d6"),
        ("e1", "c1"),  # castle queenside
    ])

    board = state["board"]
    # King at c1 (row 7, col 2)
    assert board[7][2]["piece_type"] == "king"
    # Rook at d1 (row 7, col 3)
    assert board[7][3]["piece_type"] == "rook"


@pytest.mark.asyncio
async def test_promotion_to_queen(client):
    """Advance a pawn to the back rank and promote."""
    # Use a pre-set FEN where a white pawn is on e7
    from chess.notation.fen import parse_fen
    from chess.store.game_store import GameStore

    fen = "3k4/4P3/8/8/8/8/8/4K3 w - - 0 1"
    state = parse_fen(fen)
    store = GameStore()
    game_id, _ = store.create()
    store.update(game_id, state)
    app.dependency_overrides[get_store] = lambda: store

    resp = await client.post(f"/games/{game_id}/moves",
                             json={"from_sq": "e7", "to_sq": "e8", "promotion": "queen"})
    assert resp.status_code == 200
    data = resp.json()
    board = data["board"]
    # Queen at e8 (row 0, col 4)
    assert board[0][4]["piece_type"] == "queen"
    assert board[0][4]["color"] == "white"
