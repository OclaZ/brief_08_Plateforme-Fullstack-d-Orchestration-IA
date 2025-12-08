import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException

# Import the function you want to test
from routes.analyze import query_huggingface_api


def test_query_huggingface_api_success():
    """Test a successful Hugging Face API call using a mock."""
    
    fake_payload = {"inputs": "Hello world"}

    # Fake data returned by the mocked HF API
    fake_response_json = [{"label": "IT", "score": 0.95}]

    # Mocking httpx.Client.post()
    with patch("httpx.Client.post") as mock_post:
        mock = MagicMock()
        mock.status_code = 200
        mock.json.return_value = fake_response_json
        mock_post.return_value = mock

        result = query_huggingface_api(fake_payload)

        assert result == fake_response_json
        assert result[0]["label"] == "IT"
        assert result[0]["score"] == 0.95



def test_query_huggingface_api_unauthorized():
    """Test if the function raises HTTPException when token invalid (401)."""

    fake_payload = {"inputs": "Test"}

    with patch("httpx.Client.post") as mock_post:
        mock = MagicMock()
        mock.status_code = 401
        mock_post.return_value = mock

        with pytest.raises(HTTPException) as exc:
            query_huggingface_api(fake_payload)

        assert exc.value.status_code == 503
        assert "invalide" in exc.value.detail
