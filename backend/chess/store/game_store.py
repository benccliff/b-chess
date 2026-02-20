import threading
import uuid
from ..models.game_state import GameState


class GameStore:
    def __init__(self) -> None:
        self._games: dict[str, GameState] = {}
        self._lock = threading.Lock()

    def create(self) -> tuple[str, GameState]:
        game_id = str(uuid.uuid4())
        state = GameState.initial()
        with self._lock:
            self._games[game_id] = state
        return game_id, state

    def get(self, game_id: str) -> GameState | None:
        with self._lock:
            return self._games.get(game_id)

    def update(self, game_id: str, state: GameState) -> None:
        with self._lock:
            self._games[game_id] = state

    def delete(self, game_id: str) -> bool:
        with self._lock:
            if game_id in self._games:
                del self._games[game_id]
                return True
            return False
