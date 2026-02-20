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


@pytest.mark.asyncio
async def test_create_game(client):
    resp = await client.post("/games")
    assert resp.status_code == 201
    data = resp.json()
    assert "game_id" in data
    assert data["turn"] == "white"
    assert data["status"] == "active"
    assert len(data["legal_moves"]) == 20


@pytest.mark.asyncio
async def test_get_game(client):
    resp = await client.post("/games")
    game_id = resp.json()["game_id"]

    resp2 = await client.get(f"/games/{game_id}")
    assert resp2.status_code == 200
    assert resp2.json()["game_id"] == game_id


@pytest.mark.asyncio
async def test_get_unknown_game(client):
    resp = await client.get("/games/nonexistent")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_legal_move_updates_state(client):
    resp = await client.post("/games")
    game_id = resp.json()["game_id"]

    move_resp = await client.post(f"/games/{game_id}/moves", json={"from_sq": "e2", "to_sq": "e4"})
    assert move_resp.status_code == 200
    data = move_resp.json()
    assert data["turn"] == "black"
    # Check pawn moved
    board = data["board"]
    e4_row, e4_col = 4, 4  # e4 = row 4, col 4
    assert board[e4_row][e4_col]["piece_type"] == "pawn"


@pytest.mark.asyncio
async def test_illegal_move_returns_422(client):
    resp = await client.post("/games")
    game_id = resp.json()["game_id"]

    move_resp = await client.post(f"/games/{game_id}/moves", json={"from_sq": "e2", "to_sq": "e5"})
    assert move_resp.status_code == 422


@pytest.mark.asyncio
async def test_move_on_unknown_game(client):
    resp = await client.post(f"/games/bad-id/moves", json={"from_sq": "e2", "to_sq": "e4"})
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_game(client):
    resp = await client.post("/games")
    game_id = resp.json()["game_id"]

    del_resp = await client.delete(f"/games/{game_id}")
    assert del_resp.status_code == 200

    get_resp = await client.get(f"/games/{game_id}")
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_unknown_game(client):
    resp = await client.delete("/games/nonexistent")
    assert resp.status_code == 404
