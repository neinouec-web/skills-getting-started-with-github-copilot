import copy

import pytest
from fastapi.testclient import TestClient

from src.app import activities, app


@pytest.fixture(autouse=True)
def reset_activities_state():
    """Reset in-memory state after each test to avoid cross-test side effects."""
    original_state = copy.deepcopy(activities)
    yield
    activities.clear()
    activities.update(original_state)


@pytest.fixture
def client():
    return TestClient(app)
