from __future__ import annotations


def direction(value: float) -> int:
    if value > 0:
        return 1
    if value < 0:
        return -1
    return 0
