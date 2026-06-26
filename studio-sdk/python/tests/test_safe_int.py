"""Tests for the safe_int helper."""

from linto.tools.safe_int import safe_int


class TestSafeInt:
    def test_returns_int_unchanged(self):
        assert safe_int(3) == 3
        assert safe_int(0) == 0
        assert safe_int(-5) == -5

    def test_parses_numeric_string(self):
        assert safe_int("3") == 3
        assert safe_int("0") == 0
        assert safe_int("-7") == -7

    def test_returns_default_on_none(self):
        assert safe_int(None) == 0
        assert safe_int(None, default=42) == 42

    def test_returns_default_on_invalid_string(self):
        assert safe_int("abc") == 0
        assert safe_int("", default=10) == 10
        assert safe_int("3.5") == 0  # int() rejects decimal strings

    def test_returns_default_on_unsupported_type(self):
        assert safe_int([1, 2], default=99) == 99
        assert safe_int({"a": 1}, default=99) == 99

    def test_truncates_float(self):
        # int() truncates floats — keep the same behavior.
        assert safe_int(3.7) == 3
        assert safe_int(-3.7) == -3

    def test_default_is_zero_when_unset(self):
        assert safe_int("nope") == 0
