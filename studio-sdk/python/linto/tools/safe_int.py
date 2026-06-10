
def safe_int(value, default=0):
    """Convert `value` to int, returning `default` on None or invalid input."""
    if value is None:
        return default
    try:
        return int(value)
    except (TypeError, ValueError):
        return default
