## Patterns

### Twins

> 2-of-a-kind next to each other.

As no 3-in-a-row is possible, adjacent cells on the same row / columns next to twins must be the opposite piece.

```
| _ | A | A | _ | _ | _ |

            ↓

| B | A | A | B | _ | _ |
```

A special happens when twins are on an edge:

```
| A | A | _ | _ | _ | _ |

            ↓

| A | A | B | _ | _ | B |
```

as `| A | A | _ | _ | _ | B |` would lead to a 3-in-a-row.

### Gaps

> 2-of-a-kind seperated by an empty cell.

As no 3-of-a-kind is possible, the middle cell must be the opposite piece.

```
| _ | A | _ | A | _ | _ |

            ↓

| _ | A | B | A | _ | _ |
```