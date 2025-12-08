import pytest
from unittest.mock import patch, MagicMock
from routes.analyze import query_gemini


def test_query_gemini_success():
    """Test Gemini summary + sentiment extraction with mock."""

    # Fake text & category
    sample_text = "This is a test article."
    sample_category = "IT"

    # Fake Gemini output
    fake_output = """
    SENTIMENT: Positive
    SUMMARY: This is a summary of the text.
    """

    # Mocking model.generate_content()
    with patch("google.generativeai.GenerativeModel.generate_content") as mock_gen:
        mock_response = MagicMock()
        mock_response.text = fake_output
        mock_gen.return_value = mock_response

        summary, sentiment = query_gemini(sample_text, sample_category)

        assert sentiment == "Positive"
        assert summary == "This is a summary of the text."


def test_query_gemini_failure():
    """Gemini should return fallback values if an exception happens."""

    # Make Gemini raise an error
    with patch("google.generativeai.GenerativeModel.generate_content", side_effect=Exception("Boom")):
        summary, sentiment = query_gemini("text", "IT")

        assert sentiment == "Neutral"    
        assert "Error:" in summary        
