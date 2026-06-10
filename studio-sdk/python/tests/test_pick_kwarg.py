"""Tests for the pick_kwarg helper."""

from linto.tools.pick_kwarg import pick_kwarg


class TestPickKwarg:
    def test_returns_value_when_first_key_matches(self):
        kwargs = {"enableDiarization": True}
        assert pick_kwarg(kwargs, "enableDiarization", "enable_diarization") is True

    def test_returns_value_when_second_key_matches(self):
        kwargs = {"enable_diarization": True}
        assert pick_kwarg(kwargs, "enableDiarization", "enable_diarization") is True

    def test_first_key_takes_precedence_over_later_keys(self):
        kwargs = {"enableDiarization": "first", "enable_diarization": "second"}
        assert pick_kwarg(kwargs, "enableDiarization", "enable_diarization") == "first"

    def test_returns_default_when_no_key_matches(self):
        assert pick_kwarg({}, "a", "b", default="fallback") == "fallback"

    def test_default_is_none_when_unset(self):
        assert pick_kwarg({}, "a", "b") is None

    def test_falsy_values_are_returned_not_skipped(self):
        # False / 0 / "" are valid values and must override the default.
        assert pick_kwarg({"flag": False}, "flag", default=True) is False
        assert pick_kwarg({"count": 0}, "count", default=42) == 0
        assert pick_kwarg({"name": ""}, "name", default="x") == ""

    def test_none_value_is_returned_not_skipped(self):
        # An explicit None in kwargs must win over the default.
        assert pick_kwarg({"x": None}, "x", default="fallback") is None

    def test_works_with_single_key(self):
        assert pick_kwarg({"x": 1}, "x") == 1
        assert pick_kwarg({}, "x", default=7) == 7

    def test_does_not_mutate_kwargs(self):
        kwargs = {"a": 1}
        pick_kwarg(kwargs, "missing", default="x")
        assert kwargs == {"a": 1}
