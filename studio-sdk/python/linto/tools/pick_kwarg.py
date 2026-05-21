
def pick_kwarg(kwargs, *keys, default=None):
    """Return the first value found in `kwargs` for any of `keys`, else `default`.

    Used to accept both snake_case and camelCase variants of the same option
    without silently dropping one of them.
    """
    for key in keys:
        if key in kwargs:
            return kwargs[key]
    return default
