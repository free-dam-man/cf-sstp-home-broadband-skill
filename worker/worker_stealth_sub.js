import { connect } from 'cloudflare:sockets';

const ID = '<YOUR_UUID>';
const SUB_TOKEN = '<YOUR_SUB_TOKEN>';
const HOST_DOMAIN = '<YOUR_CUSTOM_DOMAIN>';
const decStr = s => new TextDecoder().decode(Uint8Array.from(atob(s), c => c.charCodeAt(0)));
const CFG = JSON.parse(decStr('eyJub2RlcyI6IFt7ImNjIjogIlx1ZDgzY1x1ZGRlZlx1ZDgzY1x1ZGRmNSBKUCIsICJjb3VudHJ5IjogIkphcGFuIiwgIm5hbWUiOiAiXHU2NWU1XHU2NzJjXHU0ZTFjXHU0ZWFjIFNvZnRCYW5rXHU1MzlmXHU3NTFmXHU1YmI2XHU1YmJkIiwgImhvc3QiOiAidnBuMjY3OTQ3MTM5Lm9wZW5ndy5uZXQiLCAicG9ydCI6IDE2NjMsICJpc3AiOiAiU29mdEJhbmsgQkIiLCAiZnJhdWQiOiAwLCAiZW50cnkiOiAiMTA0LjE3LjEyMi4yOTo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZWZcdWQ4M2NcdWRkZjUgSlAiLCAiY291bnRyeSI6ICJKYXBhbiIsICJuYW1lIjogIlx1NjVlNVx1NjcyY1x1NTkyN1x1OTYyYSBLRERJXHU1MTQ5XHU3ZWE0XHU1YmI2XHU1YmJkIiwgImhvc3QiOiAidnBuNTQ3NDMzMTA5Lm9wZW5ndy5uZXQiLCAicG9ydCI6IDk5NSwgImlzcCI6ICJLRERJIEhvbWUgRmliZXIiLCAiZnJhdWQiOiAwLCAiZW50cnkiOiAiMTA0LjE3LjE4NS42ODo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZWZcdWQ4M2NcdWRkZjUgSlAiLCAiY291bnRyeSI6ICJKYXBhbiIsICJuYW1lIjogIlx1NjVlNVx1NjcyY1x1NzIzMVx1NzdlNSBOVFRcdTUzOWZcdTc1MWZcdTViYjZcdTViYmQiLCAiaG9zdCI6ICJrYW5yYXRvd24ub3Blbmd3Lm5ldCIsICJwb3J0IjogOTkyLCAiaXNwIjogIk5UVCBIb21lIEZpYmVyIiwgImZyYXVkIjogMCwgImVudHJ5IjogIjEwNC4xNy4xNjIuMzo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZjBcdWQ4M2NcdWRkZjcgS1IiLCAiY291bnRyeSI6ICJLb3JlYSBSZXB1YmxpYyBvZiIsICJuYW1lIjogIlx1OTdlOVx1NTZmZFx1OTk5Nlx1NWMxNCBLVFx1NTM5Zlx1NzUxZlx1NWJiNlx1NWJiZCIsICJob3N0IjogInZwbjIxMDU5OTk3OC5vcGVuZ3cubmV0IiwgInBvcnQiOiA5OTUsICJpc3AiOiAiS29yZWEgVGVsZWNvbSIsICJmcmF1ZCI6IDAsICJlbnRyeSI6ICIxMDQuMTYuMTUxLjU6NDQzIn0sIHsiY2MiOiAiXHVkODNjXHVkZGYwXHVkODNjXHVkZGY3IEtSIiwgImNvdW50cnkiOiAiS29yZWEgUmVwdWJsaWMgb2YiLCAibmFtZSI6ICJcdTk3ZTlcdTU2ZmRcdTk5OTZcdTVjMTQgU0tCXHU1MzlmXHU3NTFmXHU1YmI2XHU1YmJkIiwgImhvc3QiOiAidnBuMTc3NDYzNDUxLm9wZW5ndy5uZXQiLCAicG9ydCI6IDk5NSwgImlzcCI6ICJTSyBCcm9hZGJhbmQiLCAiZnJhdWQiOiAwLCAiZW50cnkiOiAiMTA0LjE3LjQ4LjIzNTo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZjBcdWQ4M2NcdWRkZjcgS1IiLCAiY291bnRyeSI6ICJLb3JlYSBSZXB1YmxpYyBvZiIsICJuYW1lIjogIlx1OTdlOVx1NTZmZFx1NGVjMVx1NWRkZCBMR1UrXHU1MzlmXHU3NTFmXHU1YmI2XHU1YmJkIiwgImhvc3QiOiAidnBuMzEzMzI1OTczLm9wZW5ndy5uZXQiLCAicG9ydCI6IDk5NSwgImlzcCI6ICJMRyBVcGx1cyIsICJmcmF1ZCI6IDAsICJlbnRyeSI6ICIxMDQuMTcuMTAwLjIxNTo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZmFcdWQ4M2NcdWRkZjggVVMiLCAiY291bnRyeSI6ICJVbml0ZWQgU3RhdGVzIiwgIm5hbWUiOiAiXHU3ZjhlXHU1NmZkXHU2ZDFiXHU2NzQ5XHU3N2Y2IFNwZWN0cnVtXHU1MzlmXHU3NTFmXHU1YmI2XHU1YmJkIiwgImhvc3QiOiAidnBuNDczMTk3NTM2Lm9wZW5ndy5uZXQiLCAicG9ydCI6IDE0NzUsICJpc3AiOiAiQ2hhcnRlciBTcGVjdHJ1bSIsICJmcmF1ZCI6IDIsICJlbnRyeSI6ICIxMDQuMTcuMTE1LjE4ODo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZmFcdWQ4M2NcdWRkZjggVVMiLCAiY291bnRyeSI6ICJVbml0ZWQgU3RhdGVzIiwgIm5hbWUiOiAiXHU3ZjhlXHU1NmZkXHU4MjlkXHU1MmEwXHU1NGU1IENvbWNhc3QgWGZpbml0eVx1NWJiNlx1NWJiZCIsICJob3N0IjogInZwbjUxODEyMjI4Ny5vcGVuZ3cubmV0IiwgInBvcnQiOiAxOTYwLCAiaXNwIjogIkNvbWNhc3QgWGZpbml0eSIsICJmcmF1ZCI6IDMsICJlbnRyeSI6ICIxMDQuMTYuMTQ1LjU5OjQ0MyJ9LCB7ImNjIjogIlx1ZDgzY1x1ZGRmYVx1ZDgzY1x1ZGRmOCBVUyIsICJjb3VudHJ5IjogIlVuaXRlZCBTdGF0ZXMiLCAibmFtZSI6ICJcdTdmOGVcdTU2ZmRcdTdlYmRcdTdlYTYgVmVyaXpvbiBGaW9zXHU1MzlmXHU3NTFmXHU1YmI2XHU1YmJkIiwgImhvc3QiOiAidnBuODYxMjU3NjE5Lm9wZW5ndy5uZXQiLCAicG9ydCI6IDE3MTcsICJpc3AiOiAiVmVyaXpvbiBGaW9zIiwgImZyYXVkIjogMiwgImVudHJ5IjogIjEwNC4xNy4xMjIuMjk6NDQzIn0sIHsiY2MiOiAiXHVkODNjXHVkZGU4XHVkODNjXHVkZGU2IENBIiwgImNvdW50cnkiOiAiQ2FuYWRhIiwgIm5hbWUiOiAiXHU1MmEwXHU2MmZmXHU1OTI3XHU2ZTI5XHU1NGU1XHU1MzRlIEJlbGwvVGVsdXNcdTUzOWZcdTc1MWZcdTViYjZcdTViYmQiLCAiaG9zdCI6ICJ2cG45NDIxMDAwMjUub3Blbmd3Lm5ldCIsICJwb3J0IjogOTk1LCAiaXNwIjogIkJlbGwgQ2FuYWRhIiwgImZyYXVkIjogMiwgImVudHJ5IjogIjEwNC4xNy4xODUuNjg6NDQzIn0sIHsiY2MiOiAiXHVkODNjXHVkZGVkXHVkODNjXHVkZGYwIEhLIiwgImNvdW50cnkiOiAiSG9uZyBLb25nIiwgIm5hbWUiOiAiXHU0ZTJkXHU1NmZkXHU5OTk5XHU2ZTJmIEhLVFx1N2Y1MVx1NGUwYVx1ODg0Y1x1NTM5Zlx1NzUxZlx1NWJiZFx1OTg5MSIsICJob3N0IjogInZwbjk4Njc1NTQ4NC5vcGVuZ3cubmV0IiwgInBvcnQiOiAxODUyLCAiaXNwIjogIkhLVCBMaW1pdGVkIiwgImZyYXVkIjogMywgImVudHJ5IjogIjEwNC4xNy4xNjIuMzo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZTZcdWQ4M2NcdWRkZmEgQVUiLCAiY291bnRyeSI6ICJBdXN0cmFsaWEiLCAibmFtZSI6ICJcdTZmYjNcdTU5MjdcdTUyMjlcdTRlOWFcdTU4YThcdTVjMTRcdTY3MmMgVGVsc3RyYVx1NTM5Zlx1NzUxZlx1NWJiNlx1NWJiZCIsICJob3N0IjogInZwbjEwMzk0ODE3Mi5vcGVuZ3cubmV0IiwgInBvcnQiOiAxNzg1LCAiaXNwIjogIlRlbHN0cmEgTGltaXRlZCIsICJmcmF1ZCI6IDIsICJlbnRyeSI6ICIxMDQuMTYuMTUxLjU6NDQzIn0sIHsiY2MiOiAiXHVkODNjXHVkZGVjXHVkODNjXHVkZGU3IFVLIiwgImNvdW50cnkiOiAiVW5pdGVkIEtpbmdkb20iLCAibmFtZSI6ICJcdTgyZjFcdTU2ZmRcdTRmMjZcdTY1NjYgQlQvVmlyZ2luXHU1MzlmXHU3NTFmXHU1YmI2XHU1YmJkIiwgImhvc3QiOiAidnBuODkwMjEwMzc5Lm9wZW5ndy5uZXQiLCAicG9ydCI6IDE5MTYsICJpc3AiOiAiQlQgUmVzaWRlbnRpYWwiLCAiZnJhdWQiOiAzLCAiZW50cnkiOiAiMTA0LjE3LjQ4LjIzNTo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZTlcdWQ4M2NcdWRkZWEgREUiLCAiY291bnRyeSI6ICJHZXJtYW55IiwgIm5hbWUiOiAiXHU1ZmI3XHU1NmZkXHU2Y2Q1XHU1MTcwXHU1MTRiXHU3OThmIERldXRzY2hlIFRlbGVrb21cdTViYjZcdTViYmQiLCAiaG9zdCI6ICJ2cG41NzkxMjc4NzMub3Blbmd3Lm5ldCIsICJwb3J0IjogNDQzLCAiaXNwIjogIkRldXRzY2hlIFRlbGVrb20iLCAiZnJhdWQiOiAyLCAiZW50cnkiOiAiMTA0LjE3LjEwMC4yMTU6NDQzIn0sIHsiY2MiOiAiXHVkODNjXHVkZGViXHVkODNjXHVkZGY3IEZSIiwgImNvdW50cnkiOiAiRnJhbmNlIiwgIm5hbWUiOiAiXHU2Y2Q1XHU1NmZkXHU1ZGY0XHU5ZWNlIE9yYW5nZS9GcmVlXHU1MzlmXHU3NTFmXHU1YmI2XHU1YmJkIiwgImhvc3QiOiAidnBuMjk4MzU0MjA2Lm9wZW5ndy5uZXQiLCAicG9ydCI6IDE5OTEsICJpc3AiOiAiT3JhbmdlIEZyYW5jZSIsICJmcmF1ZCI6IDMsICJlbnRyeSI6ICIxMDQuMTcuMTE1LjE4ODo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZjNcdWQ4M2NcdWRkZjEgTkwiLCAiY291bnRyeSI6ICJOZXRoZXJsYW5kcyIsICJuYW1lIjogIlx1ODM3N1x1NTE3MFx1OTYzZlx1NTljNlx1NjVhZlx1NzI3OVx1NGUzOSBLUE4vWmlnZ29cdTUzOWZcdTc1MWZcdTViYjZcdTViYmQiLCAiaG9zdCI6ICJ2cG45NDk3ODgwODYub3Blbmd3Lm5ldCIsICJwb3J0IjogMTUxMywgImlzcCI6ICJLUE4gUmVzaWRlbnRpYWwiLCAiZnJhdWQiOiAyLCAiZW50cnkiOiAiMTA0LjE2LjE0NS41OTo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZTdcdWQ4M2NcdWRkZWEgQkUiLCAiY291bnRyeSI6ICJCZWxnaXVtIiwgIm5hbWUiOiAiXHU2YmQ0XHU1MjI5XHU2NWY2XHU1ZTAzXHU5YzgxXHU1ODVlXHU1YzE0IFByb3hpbXVzXHU1MzlmXHU3NTFmXHU1YmI2XHU1YmJkIiwgImhvc3QiOiAidnBuMzE2Nzc2MDAzLm9wZW5ndy5uZXQiLCAicG9ydCI6IDE1MTcsICJpc3AiOiAiUHJveGltdXMgQVMiLCAiZnJhdWQiOiAzLCAiZW50cnkiOiAiMTA0LjE3LjEyMi4yOTo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZjNcdWQ4M2NcdWRkZjQgTk8iLCAiY291bnRyeSI6ICJOb3J3YXkiLCAibmFtZSI6ICJcdTYzMmFcdTVhMDFcdTU5NjVcdTY1YWZcdTk2NDYgTmV4dEdlblRlbFx1NTM5Zlx1NzUxZlx1NWJiNlx1NWJiZCIsICJob3N0IjogInZwbjIzOTg2NjU1NS5vcGVuZ3cubmV0IiwgInBvcnQiOiAxODQzLCAiaXNwIjogIk5leHRHZW5UZWwgQVMiLCAiZnJhdWQiOiAyLCAiZW50cnkiOiAiMTA0LjE3LjE4NS42ODo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZWVcdWQ4M2NcdWRkZjkgSVQiLCAiY291bnRyeSI6ICJJdGFseSIsICJuYW1lIjogIlx1NjEwZlx1NTkyN1x1NTIyOVx1N2M3M1x1NTE3MCBUSU0vVm9kYWZvbmVcdTUzOWZcdTc1MWZcdTViYjZcdTViYmQiLCAiaG9zdCI6ICJ2cG4zOTg3MzY0ODQub3Blbmd3Lm5ldCIsICJwb3J0IjogMTcyMywgImlzcCI6ICJUZWxlY29tIEl0YWxpYSIsICJmcmF1ZCI6IDMsICJlbnRyeSI6ICIxMDQuMTcuMTYyLjM6NDQzIn0sIHsiY2MiOiAiXHVkODNjXHVkZGYyXHVkODNjXHVkZGZkIE1YIiwgImNvdW50cnkiOiAiTWV4aWNvIiwgIm5hbWUiOiAiXHU1OGE4XHU4OTdmXHU1NGU1XHU1N2NlIFRlbG1leFx1NTM5Zlx1NzUxZlx1NWJiNlx1NWJiZCIsICJob3N0IjogImNldHNzc2Eub3Blbmd3Lm5ldCIsICJwb3J0IjogOTkyLCAiaXNwIjogIlRlbG1leCBIb21lIiwgImZyYXVkIjogNCwgImVudHJ5IjogIjEwNC4xNi4xNTEuNTo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZjdcdWQ4M2NcdWRkZmEgUlUiLCAiY291bnRyeSI6ICJSdXNzaWFuIEZlZGVyYXRpb24iLCAibmFtZSI6ICJcdTRmYzRcdTdmNTdcdTY1YWZcdTgzYWJcdTY1YWZcdTc5ZDEgUm9zdGVsZWNvbVx1NTM5Zlx1NzUxZlx1NWJiNlx1NWJiZCIsICJob3N0IjogInZwbjk0MDY4NzExMy5vcGVuZ3cubmV0IiwgInBvcnQiOiAxNzcxLCAiaXNwIjogIlJvc3RlbGVjb20iLCAiZnJhdWQiOiAyLCAiZW50cnkiOiAiMTA0LjE3LjQ4LjIzNTo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZmFcdWQ4M2NcdWRkZTYgVUEiLCAiY291bnRyeSI6ICJVa3JhaW5lIiwgIm5hbWUiOiAiXHU0ZTRjXHU1MTRiXHU1MTcwXHU1N2ZhXHU4Zjg1IEt5aXZzdGFyXHU1MzlmXHU3NTFmXHU1YmI2XHU1YmJkIiwgImhvc3QiOiAidnBuMzEzOTg1MTQ2Lm9wZW5ndy5uZXQiLCAicG9ydCI6IDU1NTUsICJpc3AiOiAiS3lpdnN0YXIgSG9tZSIsICJmcmF1ZCI6IDMsICJlbnRyeSI6ICIxMDQuMTcuMTAwLjIxNTo0NDMifSwgeyJjYyI6ICJcdWQ4M2NcdWRkZjFcdWQ4M2NcdWRkZjkgTFQiLCAiY291bnRyeSI6ICJMaXRodWFuaWEiLCAibmFtZSI6ICJcdTdhY2JcdTk2NzZcdTViOWJcdTdlZjRcdTVjMTRcdTdlYmRcdTY1YWYgVGVsaWFcdTUzOWZcdTc1MWZcdTViYjZcdTViYmQiLCAiaG9zdCI6ICJ2cG41Mzk4MDQwOTMub3Blbmd3Lm5ldCIsICJwb3J0IjogMTk3NCwgImlzcCI6ICJUZWxpYSBMaWV0dXZhIiwgImZyYXVkIjogMiwgImVudHJ5IjogIjEwNC4xNy4xMTUuMTg4OjQ0MyJ9LCB7ImNjIjogIlx1ZDgzY1x1ZGRlOFx1ZDgzY1x1ZGRmNCBDTyIsICJjb3VudHJ5IjogIkNvbG9tYmlhIiwgIm5hbWUiOiAiXHU1NGU1XHU0ZjI2XHU2YmQ0XHU0ZTlhXHU2Y2UyXHU1NGU1XHU1OTI3IENsYXJvL0VUQlx1NTM5Zlx1NzUxZlx1NWJiNlx1NWJiZCIsICJob3N0IjogInZwbjE4MjM0NDY5Mi5vcGVuZ3cubmV0IiwgInBvcnQiOiAxMzI2LCAiaXNwIjogIkNsYXJvIENvbG9tYmlhIiwgImZyYXVkIjogNCwgImVudHJ5IjogIjEwNC4xNi4xNDUuNTk6NDQzIn0sIHsiY2MiOiAiXHVkODNjXHVkZGVkXHVkODNjXHVkZGZhIEhVIiwgImNvdW50cnkiOiAiSHVuZ2FyeSIsICJuYW1lIjogIlx1NTMwOFx1NzI1OVx1NTIyOVx1NWUwM1x1OGZiZVx1NGY2OVx1NjVhZiBNYWd5YXIgVGVsZWtvbVx1NWJiNlx1NWJiZCIsICJob3N0IjogInZwbjE2ODk4NzgxMi5vcGVuZ3cubmV0IiwgInBvcnQiOiAxNjQwLCAiaXNwIjogIk1hZ3lhciBUZWxla29tIiwgImZyYXVkIjogMiwgImVudHJ5IjogIjEwNC4xNy4xMjIuMjk6NDQzIn0sIHsiY2MiOiAiXHVkODNjXHVkZGU2XHVkODNjXHVkZGVhIEFFIiwgImNvdW50cnkiOiAiVW5pdGVkIEFyYWIgRW1pcmF0ZXMiLCAibmFtZSI6ICJcdTk2M2ZcdTgwNTRcdTkxNGJcdThmZWFcdTYyZGMgRXRpc2FsYXRcdTUzOWZcdTc1MWZcdTViYjZcdTViYmQiLCAiaG9zdCI6ICJ2cG4yMzEyOTg5ODgub3Blbmd3Lm5ldCIsICJwb3J0IjogMTk1MywgImlzcCI6ICJFdGlzYWxhdCBIb21lIiwgImZyYXVkIjogMywgImVudHJ5IjogIjEwNC4xNy4xODUuNjg6NDQzIn0sIHsiY2MiOiAiXHVkODNjXHVkZGY5XHVkODNjXHVkZGVkIFRIIiwgImNvdW50cnkiOiAiVGhhaWxhbmQiLCAibmFtZSI6ICJcdTZjZjBcdTU2ZmRcdTY2ZmNcdThjMzcgQUlTLzNCQlx1NTE0OVx1N2VhNFx1NWJiNlx1NWJiZCIsICJob3N0IjogInZwbjExMzI4MTQ2MC5vcGVuZ3cubmV0IiwgInBvcnQiOiAxNTg5LCAiaXNwIjogIlRyaXBsZSBUIEJyb2FkYmFuZCIsICJmcmF1ZCI6IDMsICJlbnRyeSI6ICIxMDQuMTcuMTYyLjM6NDQzIn0sIHsiY2MiOiAiXHVkODNjXHVkZGZiXHVkODNjXHVkZGYzIFZOIiwgImNvdW50cnkiOiAiVmlldCBOYW0iLCAibmFtZSI6ICJcdThkOGFcdTUzNTdcdTZjYjNcdTUxODUgVk5QVC9GUFRcdTUxNDlcdTdlYTRcdTViYjZcdTViYmQiLCAiaG9zdCI6ICJ2cG45NDkxNTg4MzEub3Blbmd3Lm5ldCIsICJwb3J0IjogMTY2MCwgImlzcCI6ICJWTlBUIEZpYmVyIiwgImZyYXVkIjogMSwgImVudHJ5IjogIjEwNC4xNi4xNTEuNTo0NDMifV0sICJyZW1hcCI6IFtbInZwbjkxMzkwMDAxMi5vcGVuZ3cubmV0OjE4MTciLCAidnBuMjY3OTQ3MTM5Lm9wZW5ndy5uZXQ6MTY2MyJdLCBbInZwbjkzMzI1NjI1MC5vcGVuZ3cubmV0OjE0NDgiLCAidnBuNTQ3NDMzMTA5Lm9wZW5ndy5uZXQ6OTk1Il0sIFsidnBuNjUyMzk1OTA5Lm9wZW5ndy5uZXQ6MTU2NCIsICJrYW5yYXRvd24ub3Blbmd3Lm5ldDo5OTIiXSwgWyJ2cG44MjU3Nzc4MzYub3Blbmd3Lm5ldDoxODA4IiwgInZwbjUzMjE0MjM0OS5vcGVuZ3cubmV0OjEzOTQiXSwgWyJ2cG40NjA2MDY4MjIub3Blbmd3Lm5ldDoxNDI3IiwgInZwbjIxMDU5OTk3OC5vcGVuZ3cubmV0Ojk5NSJdLCBbInZwbjIzMzAyNDk4My5vcGVuZ3cubmV0Ojk5NSIsICJ2cG4xNzc0NjM0NTEub3Blbmd3Lm5ldDo5OTUiXSwgWyJ2cG4zODg0MzI1ODQub3Blbmd3Lm5ldDoxMjAxIiwgInZwbjMxMzMyNTk3My5vcGVuZ3cubmV0Ojk5NSJdLCBbInZwbjgzMjI2NTE3OC5vcGVuZ3cubmV0OjEzMTgiLCAidnBuMzE1ODQ3MDkxLm9wZW5ndy5uZXQ6MTg0MCJdLCBbInZwbjk3NDE2NjM0MS5vcGVuZ3cubmV0Ojk5NSIsICJ2cG42MjQ5ODQ2MTMub3Blbmd3Lm5ldDo5OTUiXSwgWyJ2cG42ODAyODg5NTIub3Blbmd3Lm5ldDoxMjQzIiwgInZwbjUxODEyMjI4Ny5vcGVuZ3cubmV0OjE5NjAiXSwgWyJ2cG45MzU2MTM3ODQub3Blbmd3Lm5ldDo0NDMiLCAidnBuNTE4MTIyMjg3Lm9wZW5ndy5uZXQ6MTk2MCJdLCBbInZwbjczMzA4ODE5Ni5vcGVuZ3cubmV0OjE5ODUiLCAidnBuOTg2NzU1NDg0Lm9wZW5ndy5uZXQ6MTg1MiJdLCBbInZwbjkxMTkxMjA0OS5vcGVuZ3cubmV0OjE0NDYiLCAidnBuMTAzOTQ4MTcyLm9wZW5ndy5uZXQ6MTc4NSJdLCBbInZwbjYzMDYxODc1NS5vcGVuZ3cubmV0OjE5NTYiLCAidnBuOTQ5MTU4ODMxLm9wZW5ndy5uZXQ6MTY2MCJdLCBbInZwbjg0NTUwNzgwOC5vcGVuZ3cubmV0OjE5NTciLCAidnBuODY0MTMxMjczLm9wZW5ndy5uZXQ6OTk1Il0sIFsidnBuODAwNTQ3MTk4Lm9wZW5ndy5uZXQ6MTk5OCIsICJ2cG43MDYwMDAyMzUub3Blbmd3Lm5ldDoxNDEzIl0sIFsidnBuMzE1MzMxMTUzLm9wZW5ndy5uZXQ6MTYyMiIsICJ2cG4xMTMyODE0NjAub3Blbmd3Lm5ldDoxNTg5Il0sIFsidnBuNzc1NTY3MTgxLm9wZW5ndy5uZXQ6MTkwMSIsICJ2cG4yMzk4NjY1NTUub3Blbmd3Lm5ldDoxODQzIl0sIFsidnBuMzcxMzY5NzI1Lm9wZW5ndy5uZXQ6NDQzIiwgInZwbjk0MDY4NzExMy5vcGVuZ3cubmV0OjE3NzEiXSwgWyJ2cG4yOTA5MDEwNzIub3Blbmd3Lm5ldDo0NDMiLCAidnBuODYxMjU3NjE5Lm9wZW5ndy5uZXQ6MTcxNyJdLCBbInZwbjE1ODI5NzI2Ni5vcGVuZ3cubmV0Ojk5NSIsICJjZXRzc3NhLm9wZW5ndy5uZXQ6OTkyIl1dLCAiYmFja3VwcyI6IFtbInZwbjI2Nzk0NzEzOS5vcGVuZ3cubmV0OjE2NjMiLCBbInZwbjUzMjE0MjM0OS5vcGVuZ3cubmV0OjEzOTQiLCAidnBuOTY0NjMwODAzLm9wZW5ndy5uZXQ6MTU2OCJdXSwgWyJ2cG41NDc0MzMxMDkub3Blbmd3Lm5ldDo5OTUiLCBbInZwbjcxNjE4NzA2My5vcGVuZ3cubmV0OjE2MzIiLCAidnBuMzY2MTY2NDAxLm9wZW5ndy5uZXQ6MTgxNyJdXSwgWyJrYW5yYXRvd24ub3Blbmd3Lm5ldDo5OTIiLCBbInZwbjY5OTg4NDA3My5vcGVuZ3cubmV0OjE1NTYiLCAidnBuNjE1MDQ2NjM3Lm9wZW5ndy5uZXQ6MTM0MSJdXSwgWyJ2cG4yMTA1OTk5Nzgub3Blbmd3Lm5ldDo5OTUiLCBbInZwbjMxNTg0NzA5MS5vcGVuZ3cubmV0OjE4NDAiLCAidnBuNjI0OTg0NjEzLm9wZW5ndy5uZXQ6OTk1Il1dLCBbInZwbjE3NzQ2MzQ1MS5vcGVuZ3cubmV0Ojk5NSIsIFsidnBuODkwNjEzMzUyLm9wZW5ndy5uZXQ6OTk1IiwgInZwbjQ2NjI4MTg4NC5vcGVuZ3cubmV0OjE5MDAiXV0sIFsidnBuMzEzMzI1OTczLm9wZW5ndy5uZXQ6OTk1IiwgWyJ2cG4xNzY0NzMyODUub3Blbmd3Lm5ldDo5OTUiLCAidnBuNzE1OTUzNTMzLm9wZW5ndy5uZXQ6OTk1Il1dLCBbInZwbjQ3MzE5NzUzNi5vcGVuZ3cubmV0OjE0NzUiLCBbInZwbjgwMTQ5NDI1MS5vcGVuZ3cubmV0OjE5MjkiLCAidnBuODMzMzI2MDA4Lm9wZW5ndy5uZXQ6MTQxNCJdXSwgWyJ2cG41MTgxMjIyODcub3Blbmd3Lm5ldDoxOTYwIiwgWyJ2cG44NjEyNTc2MTkub3Blbmd3Lm5ldDoxNzE3IiwgInZwbjY3MzI4MjczOC5vcGVuZ3cubmV0OjE4MTUiXV0sIFsidnBuMjkwOTAxMDcyLm9wZW5ndy5uZXQ6NDQzIiwgWyJ2cG4xNjQ2OTMwOTIub3Blbmd3Lm5ldDoxMzYzIiwgInZwbjkxODg0MDY4My5vcGVuZ3cubmV0OjEyNDUiXV0sIFsidnBuOTQyMTAwMDI1Lm9wZW5ndy5uZXQ6OTk1IiwgWyJ2cG42Mzg2OTk2MTUub3Blbmd3Lm5ldDo5OTUiLCAidnBuNDIxNDE2MDg3Lm9wZW5ndy5uZXQ6OTk1Il1dLCBbInZwbjk4Njc1NTQ4NC5vcGVuZ3cubmV0OjE4NTIiLCBbInZwbjgwNzMxOTAyNC5vcGVuZ3cubmV0OjE3NjAiLCAidnBuMTg3NDMwOTE5Lm9wZW5ndy5uZXQ6OTk1Il1dLCBbInZwbjEwMzk0ODE3Mi5vcGVuZ3cubmV0OjE3ODUiLCBbInZwbjc1OTc2MTIwMS5vcGVuZ3cubmV0OjE1MjEiLCAiZGlhbW9uZGduZC5vcGVuZ3cubmV0OjQ0MyJdXSwgWyJ2cG44OTAyMTAzNzkub3Blbmd3Lm5ldDoxOTE2IiwgWyJ2cG44NjUyMzk2ODcub3Blbmd3Lm5ldDoxNDkxIiwgInBhdGl0by5vcGVuZ3cubmV0OjE3NTAiXV0sIFsidnBuNTc5MTI3ODczLm9wZW5ndy5uZXQ6NDQzIiwgWyJ2cG43ODcxNDMwNTYub3Blbmd3Lm5ldDoxNjAzIiwgInZwbjk4ODA0NjEzNi5vcGVuZ3cubmV0OjE1NzUiXV0sIFsidnBuMjk4MzU0MjA2Lm9wZW5ndy5uZXQ6MTk5MSIsIFsic25tYXJyb24ub3Blbmd3Lm5ldDo5OTIiLCAidnBuNzcwMjEwNjIwLm9wZW5ndy5uZXQ6MTc0MyJdXSwgWyJ2cG45NDk3ODgwODYub3Blbmd3Lm5ldDoxNTEzIiwgWyJ2cG4zMTY3NzYwMDMub3Blbmd3Lm5ldDoxNTE3IiwgInZwbjU3OTEyNzg3My5vcGVuZ3cubmV0OjQ0MyJdXSwgWyJ2cG4zMTY3NzYwMDMub3Blbmd3Lm5ldDoxNTE3IiwgWyJ2cG40NTUwNzQ5Mjgub3Blbmd3Lm5ldDoxODgwIiwgInZwbjk2NzQzNzE2NC5vcGVuZ3cubmV0OjEyMzQiXV0sIFsidnBuMjM5ODY2NTU1Lm9wZW5ndy5uZXQ6MTg0MyIsIFsidnBuMzM5MjQ5OTMwLm9wZW5ndy5uZXQ6MTQ4NCIsICJ2cG41MDMxMjAxMzUub3Blbmd3Lm5ldDoxNDI0Il1dLCBbInZwbjM5ODczNjQ4NC5vcGVuZ3cubmV0OjE3MjMiLCBbInZwbjg5MTM4ODcxNC5vcGVuZ3cubmV0OjE5NTIiLCAidnBuMzM3NDM0NjIxLm9wZW5ndy5uZXQ6MTI2MiJdXSwgWyJ2cG4xNTgyOTcyNjYub3Blbmd3Lm5ldDo5OTUiLCBbInZwbjkwNTcwNTgyNS5vcGVuZ3cubmV0OjE0MzkiLCAidnBuMjQ1NDI0NzgxLm9wZW5ndy5uZXQ6MTk1NCJdXSwgWyJ2cG45NDA2ODcxMTMub3Blbmd3Lm5ldDoxNzcxIiwgWyJ2cG4xNDY2OTE3ODQub3Blbmd3Lm5ldDoxMzkzIiwgInZwbjgwMzcwNjU1OS5vcGVuZ3cubmV0OjE1MTMiXV0sIFsidnBuMzEzOTg1MTQ2Lm9wZW5ndy5uZXQ6NTU1NSIsIFsidnBuNjYxOTgyLm9wZW5ndy5uZXQ6NzU1MSIsICJ2cG43NTY5NzgxMTEub3Blbmd3Lm5ldDoxMjIzIl1dLCBbInZwbjUzOTgwNDA5My5vcGVuZ3cubmV0OjE5NzQiLCBbInZwbjc2NTUzNjU5OS5vcGVuZ3cubmV0OjE3OTciLCAidnBuNzI4NTIyNTQwLm9wZW5ndy5uZXQ6MTIyNyJdXSwgWyJ2cG4xODIzNDQ2OTIub3Blbmd3Lm5ldDoxMzI2IiwgWyJ2cG4yOTcwMTg1MzMub3Blbmd3Lm5ldDoxNTM0IiwgInZwbjUwNjQwODE1MC5vcGVuZ3cubmV0OjE4NDYiXV0sIFsidnBuMTY4OTg3ODEyLm9wZW5ndy5uZXQ6MTY0MCIsIFsidnBuNDUxMDcxODA5Lm9wZW5ndy5uZXQ6MTk0MCIsICJ2cG40MTgxMjM3NDYub3Blbmd3Lm5ldDoxMjU1Il1dLCBbInZwbjIzMTI5ODk4OC5vcGVuZ3cubmV0OjE5NTMiLCBbInZwbjg0NzgzNjQzOS5vcGVuZ3cubmV0OjEyMTEiLCAidnBuMjMwNjkxMjgyLm9wZW5ndy5uZXQ6MTc3OSJdXSwgWyJ2cG4xMTMyODE0NjAub3Blbmd3Lm5ldDoxNTg5IiwgWyJ2cG4yODcxNDE0NDYub3Blbmd3Lm5ldDoxNjA0IiwgImlkY3JtbjIub3Blbmd3Lm5ldDo0NDQiXV0sIFsidnBuOTQ5MTU4ODMxLm9wZW5ndy5uZXQ6MTY2MCIsIFsidnBuODY0MTMxMjczLm9wZW5ndy5uZXQ6OTk1IiwgInZwbjcwNjAwMDIzNS5vcGVuZ3cubmV0OjE0MTMiXV0sIFsidnBuNjYxOTgyLm9wZW5ndy5uZXQ6NzU1MSIsIFsidnBuMjY3OTQ3MTM5Lm9wZW5ndy5uZXQ6MTY2MyIsICJ2cG41NDc0MzMxMDkub3Blbmd3Lm5ldDo5OTUiXV0sIFsidnBuNDUxMDcxODA5Lm9wZW5ndy5uZXQ6MTk0MCIsIFsidnBuMjY3OTQ3MTM5Lm9wZW5ndy5uZXQ6MTY2MyIsICJ2cG41NDc0MzMxMDkub3Blbmd3Lm5ldDo5OTUiXV0sIFsidnBuNTMyMTQyMzQ5Lm9wZW5ndy5uZXQ6MTM5NCIsIFsidnBuMjY3OTQ3MTM5Lm9wZW5ndy5uZXQ6MTY2MyIsICJ2cG41NDc0MzMxMDkub3Blbmd3Lm5ldDo5OTUiXV0sIFsidnBuNjI0OTg0NjEzLm9wZW5ndy5uZXQ6OTk1IiwgWyJ2cG4yMTA1OTk5Nzgub3Blbmd3Lm5ldDo5OTUiLCAidnBuMTc3NDYzNDUxLm9wZW5ndy5uZXQ6OTk1Il1dLCBbInZwbjM2ODcwNDg3OC5vcGVuZ3cubmV0OjE1MTEiLCBbInZwbjIxMDU5OTk3OC5vcGVuZ3cubmV0Ojk5NSIsICJ2cG4xNzc0NjM0NTEub3Blbmd3Lm5ldDo5OTUiXV0sIFsidnBuMzE1ODQ3MDkxLm9wZW5ndy5uZXQ6MTg0MCIsIFsidnBuMjEwNTk5OTc4Lm9wZW5ndy5uZXQ6OTk1IiwgInZwbjE3NzQ2MzQ1MS5vcGVuZ3cubmV0Ojk5NSJdXSwgWyJ2cG41MDMxMjAxMzUub3Blbmd3Lm5ldDoxNDI0IiwgWyJ2cG40NzMxOTc1MzYub3Blbmd3Lm5ldDoxNDc1IiwgInZwbjUxODEyMjI4Ny5vcGVuZ3cubmV0OjE5NjAiXV0sIFsidnBuNzg3MTQzMDU2Lm9wZW5ndy5uZXQ6MTYwMyIsIFsidnBuNDczMTk3NTM2Lm9wZW5ndy5uZXQ6MTQ3NSIsICJ2cG41MTgxMjIyODcub3Blbmd3Lm5ldDoxOTYwIl1dLCBbInZwbjgwNzMxOTAyNC5vcGVuZ3cubmV0OjE3NjAiLCBbInZwbjk4Njc1NTQ4NC5vcGVuZ3cubmV0OjE4NTIiLCAidnBuMTg3NDMwOTE5Lm9wZW5ndy5uZXQ6OTk1Il1dLCBbInZwbjg5NDkyOTA1MS5vcGVuZ3cubmV0OjE2MjIiLCBbInZwbjk0OTE1ODgzMS5vcGVuZ3cubmV0OjE2NjAiLCAidnBuODY0MTMxMjczLm9wZW5ndy5uZXQ6OTk1Il1dLCBbInZwbjg2NDEzMTI3My5vcGVuZ3cubmV0Ojk5NSIsIFsidnBuOTQ5MTU4ODMxLm9wZW5ndy5uZXQ6MTY2MCIsICJ2cG43MDYwMDAyMzUub3Blbmd3Lm5ldDoxNDEzIl1dLCBbInZwbjcwNjAwMDIzNS5vcGVuZ3cubmV0OjE0MTMiLCBbInZwbjk0OTE1ODgzMS5vcGVuZ3cubmV0OjE2NjAiLCAidnBuODY0MTMxMjczLm9wZW5ndy5uZXQ6OTk1Il1dLCBbImlkY3JtbjIub3Blbmd3Lm5ldDo0NDQiLCBbInZwbjExMzI4MTQ2MC5vcGVuZ3cubmV0OjE1ODkiLCAidnBuMjg3MTQxNDQ2Lm9wZW5ndy5uZXQ6MTYwNCJdXSwgWyJjZXRzc3NhLm9wZW5ndy5uZXQ6OTkyIiwgWyJ2cG41MTgxMjIyODcub3Blbmd3Lm5ldDoxOTYwIiwgInZwbjg2MTI1NzYxOS5vcGVuZ3cubmV0OjE3MTciXV0sIFsidnBuODY1MjM5Njg3Lm9wZW5ndy5uZXQ6MTQ5MSIsIFsidnBuODkwMjEwMzc5Lm9wZW5ndy5uZXQ6MTkxNiIsICJwYXRpdG8ub3Blbmd3Lm5ldDoxNzUwIl1dLCBbInZwbjg2MTI1NzYxOS5vcGVuZ3cubmV0OjE3MTciLCBbInZwbjgzMzMyNjAwOC5vcGVuZ3cubmV0OjE0MTQiLCAidnBuMTY0NjkzMDkyLm9wZW5ndy5uZXQ6MTM2MyJdXV0sICJoYyI6IFtbInZwbjI2Nzk0NzEzOS5vcGVuZ3cubmV0OjE2NjMiLCAiSmFwYW4iXSwgWyJ2cG41NDc0MzMxMDkub3Blbmd3Lm5ldDo5OTUiLCAiSmFwYW4iXSwgWyJrYW5yYXRvd24ub3Blbmd3Lm5ldDo5OTIiLCAiSmFwYW4iXSwgWyJ2cG4yMTA1OTk5Nzgub3Blbmd3Lm5ldDo5OTUiLCAiS29yZWEgUmVwdWJsaWMgb2YiXSwgWyJ2cG4xNzc0NjM0NTEub3Blbmd3Lm5ldDo5OTUiLCAiS29yZWEgUmVwdWJsaWMgb2YiXSwgWyJ2cG4zMTMzMjU5NzMub3Blbmd3Lm5ldDo5OTUiLCAiS29yZWEgUmVwdWJsaWMgb2YiXSwgWyJ2cG40NzMxOTc1MzYub3Blbmd3Lm5ldDoxNDc1IiwgIlVuaXRlZCBTdGF0ZXMiXSwgWyJ2cG41MTgxMjIyODcub3Blbmd3Lm5ldDoxOTYwIiwgIlVuaXRlZCBTdGF0ZXMiXSwgWyJ2cG4yOTA5MDEwNzIub3Blbmd3Lm5ldDo0NDMiLCAiVW5pdGVkIFN0YXRlcyJdLCBbInZwbjk0MjEwMDAyNS5vcGVuZ3cubmV0Ojk5NSIsICJDYW5hZGEiXSwgWyJ2cG45ODY3NTU0ODQub3Blbmd3Lm5ldDoxODUyIiwgIkhvbmcgS29uZyJdLCBbInZwbjEwMzk0ODE3Mi5vcGVuZ3cubmV0OjE3ODUiLCAiQXVzdHJhbGlhIl0sIFsidnBuODkwMjEwMzc5Lm9wZW5ndy5uZXQ6MTkxNiIsICJVbml0ZWQgS2luZ2RvbSJdLCBbInZwbjU3OTEyNzg3My5vcGVuZ3cubmV0OjQ0MyIsICJHZXJtYW55Il0sIFsidnBuMjk4MzU0MjA2Lm9wZW5ndy5uZXQ6MTk5MSIsICJGcmFuY2UiXSwgWyJ2cG45NDk3ODgwODYub3Blbmd3Lm5ldDoxNTEzIiwgIk5ldGhlcmxhbmRzIl0sIFsidnBuMzE2Nzc2MDAzLm9wZW5ndy5uZXQ6MTUxNyIsICJCZWxnaXVtIl0sIFsidnBuMjM5ODY2NTU1Lm9wZW5ndy5uZXQ6MTg0MyIsICJOb3J3YXkiXSwgWyJ2cG4zOTg3MzY0ODQub3Blbmd3Lm5ldDoxNzIzIiwgIkl0YWx5Il0sIFsidnBuMTU4Mjk3MjY2Lm9wZW5ndy5uZXQ6OTk1IiwgIk1leGljbyJdLCBbInZwbjk0MDY4NzExMy5vcGVuZ3cubmV0OjE3NzEiLCAiUnVzc2lhbiBGZWRlcmF0aW9uIl0sIFsidnBuMzEzOTg1MTQ2Lm9wZW5ndy5uZXQ6NTU1NSIsICJVa3JhaW5lIl0sIFsidnBuNTM5ODA0MDkzLm9wZW5ndy5uZXQ6MTk3NCIsICJMaXRodWFuaWEiXSwgWyJ2cG4xODIzNDQ2OTIub3Blbmd3Lm5ldDoxMzI2IiwgIkNvbG9tYmlhIl0sIFsidnBuMTY4OTg3ODEyLm9wZW5ndy5uZXQ6MTY0MCIsICJIdW5nYXJ5Il0sIFsidnBuMjMxMjk4OTg4Lm9wZW5ndy5uZXQ6MTk1MyIsICJVbml0ZWQgQXJhYiBFbWlyYXRlcyJdLCBbInZwbjExMzI4MTQ2MC5vcGVuZ3cubmV0OjE1ODkiLCAiVGhhaWxhbmQiXSwgWyJ2cG45NDkxNTg4MzEub3Blbmd3Lm5ldDoxNjYwIiwgIlZpZXQgTmFtIl0sIFsidnBuNTMyMTQyMzQ5Lm9wZW5ndy5uZXQ6MTM5NCIsICJKYXBhbiJdLCBbInZwbjk2NDYzMDgwMy5vcGVuZ3cubmV0OjE1NjgiLCAiSmFwYW4iXSwgWyJ2cG43MTYxODcwNjMub3Blbmd3Lm5ldDoxNjMyIiwgIkphcGFuIl0sIFsidnBuMzY2MTY2NDAxLm9wZW5ndy5uZXQ6MTgxNyIsICJKYXBhbiJdLCBbInZwbjY5OTg4NDA3My5vcGVuZ3cubmV0OjE1NTYiLCAiSmFwYW4iXSwgWyJ2cG42MTUwNDY2Mzcub3Blbmd3Lm5ldDoxMzQxIiwgIkphcGFuIl0sIFsidnBuMzE1ODQ3MDkxLm9wZW5ndy5uZXQ6MTg0MCIsICJLb3JlYSBSZXB1YmxpYyBvZiJdLCBbInZwbjYyNDk4NDYxMy5vcGVuZ3cubmV0Ojk5NSIsICJLb3JlYSBSZXB1YmxpYyBvZiJdLCBbInZwbjg5MDYxMzM1Mi5vcGVuZ3cubmV0Ojk5NSIsICJLb3JlYSBSZXB1YmxpYyBvZiJdLCBbInZwbjQ2NjI4MTg4NC5vcGVuZ3cubmV0OjE5MDAiLCAiS29yZWEgUmVwdWJsaWMgb2YiXSwgWyJ2cG4xNzY0NzMyODUub3Blbmd3Lm5ldDo5OTUiLCAiS29yZWEgUmVwdWJsaWMgb2YiXSwgWyJ2cG43MTU5NTM1MzMub3Blbmd3Lm5ldDo5OTUiLCAiS29yZWEgUmVwdWJsaWMgb2YiXSwgWyJ2cG44MDE0OTQyNTEub3Blbmd3Lm5ldDoxOTI5IiwgIlVuaXRlZCBTdGF0ZXMiXSwgWyJ2cG44MzMzMjYwMDgub3Blbmd3Lm5ldDoxNDE0IiwgIlVuaXRlZCBTdGF0ZXMiXSwgWyJ2cG44NjEyNTc2MTkub3Blbmd3Lm5ldDoxNzE3IiwgIlVuaXRlZCBTdGF0ZXMiXSwgWyJ2cG42NzMyODI3Mzgub3Blbmd3Lm5ldDoxODE1IiwgIlVuaXRlZCBTdGF0ZXMiXSwgWyJ2cG4xNjQ2OTMwOTIub3Blbmd3Lm5ldDoxMzYzIiwgIlVuaXRlZCBTdGF0ZXMiXSwgWyJ2cG45MTg4NDA2ODMub3Blbmd3Lm5ldDoxMjQ1IiwgIlVuaXRlZCBTdGF0ZXMiXSwgWyJ2cG42Mzg2OTk2MTUub3Blbmd3Lm5ldDo5OTUiLCAiQ2FuYWRhIl0sIFsidnBuNDIxNDE2MDg3Lm9wZW5ndy5uZXQ6OTk1IiwgIkNhbmFkYSJdLCBbInZwbjgwNzMxOTAyNC5vcGVuZ3cubmV0OjE3NjAiLCAiSG9uZyBLb25nIl0sIFsidnBuMTg3NDMwOTE5Lm9wZW5ndy5uZXQ6OTk1IiwgIkhvbmcgS29uZyJdLCBbInZwbjc1OTc2MTIwMS5vcGVuZ3cubmV0OjE1MjEiLCAiQXVzdHJhbGlhIl0sIFsidnBuODY1MjM5Njg3Lm9wZW5ndy5uZXQ6MTQ5MSIsICJVbml0ZWQgS2luZ2RvbSJdLCBbInBhdGl0by5vcGVuZ3cubmV0OjE3NTAiLCAiVW5pdGVkIEtpbmdkb20iXSwgWyJzbm1hcnJvbi5vcGVuZ3cubmV0Ojk5MiIsICJGcmFuY2UiXSwgWyJ2cG4xNDY2OTE3ODQub3Blbmd3Lm5ldDoxMzkzIiwgIlJ1c3NpYW4gRmVkZXJhdGlvbiJdLCBbInZwbjgwMzcwNjU1OS5vcGVuZ3cubmV0OjE1MTMiLCAiUnVzc2lhbiBGZWRlcmF0aW9uIl0sIFsidnBuMjg3MTQxNDQ2Lm9wZW5ndy5uZXQ6MTYwNCIsICJUaGFpbGFuZCJdLCBbImlkY3JtbjIub3Blbmd3Lm5ldDo0NDQiLCAiVGhhaWxhbmQiXSwgWyJ2cG44NjQxMzEyNzMub3Blbmd3Lm5ldDo5OTUiLCAiVmlldCBOYW0iXSwgWyJ2cG43MDYwMDAyMzUub3Blbmd3Lm5ldDoxNDEzIiwgIlZpZXQgTmFtIl0sIFsidnBuNjYxOTgyLm9wZW5ndy5uZXQ6NzU1MSIsICJKYXBhbiJdLCBbInZwbjQ1MTA3MTgwOS5vcGVuZ3cubmV0OjE5NDAiLCAiSmFwYW4iXSwgWyJ2cG45MTM5MDAwMTIub3Blbmd3Lm5ldDoxODE3IiwgIkphcGFuIl0sIFsidnBuOTMzMjU2MjUwLm9wZW5ndy5uZXQ6MTQ0OCIsICJKYXBhbiJdLCBbInZwbjY1MjM5NTkwOS5vcGVuZ3cubmV0OjE1NjQiLCAiSmFwYW4iXSwgWyJ2cG44MjU3Nzc4MzYub3Blbmd3Lm5ldDoxODA4IiwgIkphcGFuIl0sIFsidnBuMzY4NzA0ODc4Lm9wZW5ndy5uZXQ6MTUxMSIsICJLb3JlYSBSZXB1YmxpYyBvZiJdLCBbInZwbjQ2MDYwNjgyMi5vcGVuZ3cubmV0OjE0MjciLCAiS29yZWEgUmVwdWJsaWMgb2YiXSwgWyJ2cG4yMzMwMjQ5ODMub3Blbmd3Lm5ldDo5OTUiLCAiS29yZWEgUmVwdWJsaWMgb2YiXSwgWyJ2cG4zODg0MzI1ODQub3Blbmd3Lm5ldDoxMjAxIiwgIktvcmVhIFJlcHVibGljIG9mIl0sIFsidnBuODMyMjY1MTc4Lm9wZW5ndy5uZXQ6MTMxOCIsICJLb3JlYSBSZXB1YmxpYyBvZiJdLCBbInZwbjk3NDE2NjM0MS5vcGVuZ3cubmV0Ojk5NSIsICJLb3JlYSBSZXB1YmxpYyBvZiJdLCBbInZwbjY4MDI4ODk1Mi5vcGVuZ3cubmV0OjEyNDMiLCAiVW5pdGVkIFN0YXRlcyJdLCBbInZwbjUwMzEyMDEzNS5vcGVuZ3cubmV0OjE0MjQiLCAiVW5pdGVkIFN0YXRlcyJdLCBbInZwbjc4NzE0MzA1Ni5vcGVuZ3cubmV0OjE2MDMiLCAiVW5pdGVkIFN0YXRlcyJdLCBbInZwbjkzNTYxMzc4NC5vcGVuZ3cubmV0OjQ0MyIsICJVbml0ZWQgU3RhdGVzIl0sIFsidnBuNzMzMDg4MTk2Lm9wZW5ndy5uZXQ6MTk4NSIsICJIb25nIEtvbmciXSwgWyJ2cG45MTE5MTIwNDkub3Blbmd3Lm5ldDoxNDQ2IiwgIkF1c3RyYWxpYSJdLCBbInZwbjg5NDkyOTA1MS5vcGVuZ3cubmV0OjE2MjIiLCAiVmlldCBOYW0iXSwgWyJ2cG42MzA2MTg3NTUub3Blbmd3Lm5ldDoxOTU2IiwgIlZpZXQgTmFtIl0sIFsidnBuODQ1NTA3ODA4Lm9wZW5ndy5uZXQ6MTk1NyIsICJWaWV0IE5hbSJdLCBbInZwbjgwMDU0NzE5OC5vcGVuZ3cubmV0OjE5OTgiLCAiVmlldCBOYW0iXSwgWyJ2cG4zMTUzMzExNTMub3Blbmd3Lm5ldDoxNjIyIiwgIlRoYWlsYW5kIl0sIFsidnBuNzc1NTY3MTgxLm9wZW5ndy5uZXQ6MTkwMSIsICJOb3J3YXkiXSwgWyJjZXRzc3NhLm9wZW5ndy5uZXQ6OTkyIiwgIk1leGljbyJdLCBbInZwbjM3MTM2OTcyNS5vcGVuZ3cubmV0OjQ0MyIsICJSdXNzaWFuIEZlZGVyYXRpb24iXV0sICJlbnRyaWVzIjogWyIxMDQuMTcuMTIyLjI5OjQ0MyIsICIxMDQuMTcuMTg1LjY4OjQ0MyIsICIxMDQuMTcuMTYyLjM6NDQzIiwgIjEwNC4xNi4xNTEuNTo0NDMiLCAiMTA0LjE3LjQ4LjIzNTo0NDMiLCAiMTA0LjE3LjEwMC4yMTU6NDQzIiwgIjEwNC4xNy4xMTUuMTg4OjQ0MyIsICIxMDQuMTYuMTQ1LjU5OjQ0MyIsICIxNzIuNjYuNDQuOTg6MjA4MyIsICIxNjIuMTU5LjE0MC4xMTY6MjA4MyIsICIxNjIuMTU5LjEyOC4yNTM6MjA1MyIsICIxMDQuMzEuMTYuMTU4OjIwNTMiXX0='));
const NODES = CFG.nodes;
const REMAP_HOST = new Map(CFG.remap);
const BACKUPS = new Map(CFG.backups);
const HOST_COUNTRY = new Map(CFG.hc);
const FALLBACK_ENTRIES = (CFG.entries && CFG.entries.length) ? CFG.entries : ['172.64.147.8:443','172.66.44.98:2083','162.159.128.253:2053'];
let liveEntries = FALLBACK_ENTRIES.slice();
let entriesMeta = { source: 'cfg', updatedAt: 0 };
const ENTRIES_KV_KEY = 'preferred_entries';
const parseEntriesPayload = raw => {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw);
    const arr = Array.isArray(j) ? j : j.entries;
    if (!Array.isArray(arr) || !arr.length) return null;
    const cleaned = [...new Set(arr.map(String).map(s => s.trim()).filter(s => /^\d+\.\d+\.\d+\.\d+:(443|2053|2083|8443|2096)$/.test(s)))];
    return cleaned.length ? cleaned : null;
  } catch {
    const cleaned = [...new Set(String(raw).split(/[\r\n,]+/).map(s => s.trim()).filter(s => /^\d+\.\d+\.\d+\.\d+:(443|2053|2083|8443|2096)$/.test(s)))];
    return cleaned.length ? cleaned : null;
  }
};
const loadEntriesFromKv = async env => {
  try {
    const raw = await env?.ENTRIES_KV?.get?.(ENTRIES_KV_KEY);
    const parsed = parseEntriesPayload(raw);
    if (parsed) { liveEntries = parsed; entriesMeta = { source: 'kv', updatedAt: Date.now() }; }
  } catch {}
};
const saveEntriesToKv = async (env, entries, note = '') => {
  if (!env?.ENTRIES_KV) return false;
  const body = JSON.stringify({ entries, updatedAt: new Date().toISOString(), note });
  await env.ENTRIES_KV.put(ENTRIES_KV_KEY, body);
  liveEntries = entries.slice();
  entriesMeta = { source: 'kv', updatedAt: Date.now(), note };
  return true;
};
/** Soft daily refresh: pull community preferred-IP top list when KV is stale (>20h). China-verified PINNED via /entries-TOKEN overrides this. */
const refreshEntriesSoft = async env => {
  const age = Date.now() - (entriesMeta.updatedAt || 0);
  if (entriesMeta.source === 'kv' && age < 20 * 3600 * 1000) return liveEntries;
  await loadEntriesFromKv(env);
  if (entriesMeta.source === 'kv' && (Date.now() - entriesMeta.updatedAt) < 20 * 3600 * 1000) return liveEntries;
  try {
    const txt = await fetch(atob('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0xhbmNlbG90UmFyL2Jlc3QtY2YtaXBzL21haW4vYmVzdC1jZi1pcC1zY2FubmVkLXRvcDIwLnR4dA=='), { cf: { cacheTtl: 3600 } }).then(r => r.text());
    const ports = [443, 2083, 2053];
    const ips = [];
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/(\d+\.\d+\.\d+\.\d+)/);
      if (m && !ips.includes(m[1])) ips.push(m[1]);
      if (ips.length >= 8) break;
    }
    if (ips.length >= 4) {
      const entries = ips.map((ip, i) => `${ip}:${ports[i % ports.length]}`);
      await saveEntriesToKv(env, entries, 'community-soft');
    }
  } catch {}
  return liveEntries;
};

const enc = new TextEncoder(), dec = new TextDecoder(), E = new Uint8Array(0);
const u16 = (b, o = 0) => (b[o] << 8) | b[o + 1], u32 = (b, o = 0) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
const cat = (...a) => { const r = new Uint8Array(a.reduce((s, x) => s + x.length, 0)); a.reduce((o, x) => (r.set(x, o), o + x.length), 0); return r; };
const csum = b => { let s = 0, i = 0; for (; i + 1 < b.length; i += 2) s += u16(b, i); if (i < b.length) s += b[i] << 8; while (s >> 16) s = (s & 0xFFFF) + (s >> 16); return (~s) & 0xFFFF; };
const tunData = d => { const l = d.length + 6, f = new Uint8Array(l); f[0] = 0x10; f[2] = (l >> 8) | 0x80; f[3] = l & 0xFF; f[4] = 0xFF; f[5] = 0x03; f.set(d, 6); return f; };
const tunCtrl = (t, a = []) => {
  let al = 0; for (const x of a) al += 4 + x.data.length; const l = 8 + al, f = new Uint8Array(l), v = new DataView(f.buffer);
  f[0] = 0x10; f[1] = 0x01; v.setUint16(2, l | 0x8000); v.setUint16(4, t); v.setUint16(6, a.length);
  let o = 8; for (const x of a) { f[o + 1] = x.id; v.setUint16(o + 2, 4 + x.data.length); f.set(x.data, o + 4); o += 4 + x.data.length; } return f;
};
const linkFrame = (pr, c, id, opts = []) => {
  let ol = 0; for (const o of opts) ol += 2 + o.data.length; const l = 4 + ol, f = new Uint8Array(2 + l), v = new DataView(f.buffer);
  v.setUint16(0, pr); f[2] = c; f[3] = id; v.setUint16(4, l); let o = 6; for (const x of opts) { f[o] = x.type; f[o + 1] = 2 + x.data.length; f.set(x.data, o + 2); o += 2 + x.data.length; } return f;
};
const authFrame = (id, u, p) => {
  const ub = enc.encode(u), pb = enc.encode(p), l = 6 + ub.length + pb.length, f = new Uint8Array(2 + l), v = new DataView(f.buffer);
  v.setUint16(0, 0xc023); f[2] = 1; f[3] = id; v.setUint16(4, l); f[6] = ub.length; f.set(ub, 7); f[7 + ub.length] = pb.length; f.set(pb, 8 + ub.length); return f;
};
const findOpt = (d, t) => { for (let i = 0; i + 2 <= d.length;) { const l = d[i + 1]; if (l < 2 || i + l > d.length) return null; if (d[i] === t) return d.subarray(i + 2, i + l); i += l; } return null; };

const staticDns = new Map([['cp.cloudflare.com', '104.16.132.229'], ['one.one.one.one', '1.1.1.1'], ['api.ipify.org', '172.67.74.152'], ['icanhazip.com', '104.18.114.97']]);
const dnsCache = new Map();
const resolveIP = async h => {
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;
  if (staticDns.has(h)) return staticDns.get(h);
  const now = Date.now(), cached = dnsCache.get(h);
  if (cached && cached.exp > now) return cached.ip;
  for (const u of [atob('aHR0cHM6Ly8xLjEuMS4xL2Rucy1xdWVyeQ=='), atob('aHR0cHM6Ly9jbG91ZGZsYXJlLWRucy5jb20vZG5zLXF1ZXJ5')]) {
    try {
      const j = await fetch(`${u}?name=${encodeURIComponent(h)}&type=A`, { headers: { Accept: atob('YXBwbGljYXRpb24vZG5zLWpzb24=') } }).then(r => r.json());
      const ip = j.Answer?.find(a => a.type === 1)?.data;
      if (ip) { if (dnsCache.size > 512) dnsCache.clear(); dnsCache.set(h, { ip, exp: now + 300000 }); return ip; }
    } catch {}
  }
  if (h.endsWith('gstatic.com') || h.endsWith('google.com')) return '142.251.150.120';
  throw new Error('DNS failed');
};

const tunRgx = new RegExp(atob('KD86XC9zXC98c3N0cDpcL1wvfFwvc3N0cFwvfFs/Jl1zc3RwPSg/OnNzdHA6XC9cLyk/KSg/OlteQC8/JiNcc10rQCk/KFthLXpBLVowLTkuLV0rKTooXGQrKQ=='), 'i');
const getTun = u => {
  try {
    const m = decodeURIComponent(u).match(tunRgx);
    if (m) return { host: m[1], port: +m[2] };
  } catch {}
  return { host: NODES[0].host, port: NODES[0].port };
};

const deadHosts = new Map();
const DEAD_TTL = 600000;
const isDead = hp => {
  const t = deadHosts.get(hp);
  if (!t) return false;
  if (Date.now() - t > DEAD_TTL) { deadHosts.delete(hp); return false; }
  return true;
};
const markDead = hp => deadHosts.set(hp, Date.now());
const markAlive = hp => deadHosts.delete(hp);

const livePoolByCountry = new Map();
let lastPoolSync = 0;
const refreshLivePool = async () => {
  const now = Date.now();
  if (now - lastPoolSync < 600000) return;
  lastPoolSync = now;
  try {
    const sfx = atob('Lm9wZW5ndy5uZXQ=');
    const txt = await fetch(atob('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3NkaXNlL3ZwbmdhdGUvbWFpbi92cG5nYXRlX3Rlc3RlZC5jc3Y=')).then(r => r.text());
    const lines = txt.split(/\r?\n/).slice(1);
    const map = new Map();
    for (const line of lines) {
      if (!line) continue;
      const p = line.split(',');
      if (p.length < 5) continue;
      const cc = p[0], host = p[1], port = Number(p[4]);
      if (!host.endsWith(sfx) || !port) continue;
      const hp = `${host}:${port}`;
      if (!map.has(cc)) map.set(cc, []);
      const arr = map.get(cc);
      if (arr.length < 8 && !arr.includes(hp)) arr.push(hp);
    }
    for (const [k, v] of map.entries()) livePoolByCountry.set(k, v);
  } catch {}
};

const openTun = (h, p) => {
  const sock = connect({ hostname: h, port: p }, { secureTransport: 'on', allowHalfOpen: false });
  const wr = sock.writable.getWriter(), rd = sock.readable.getReader();
  let buf = E, id = 0, myIp = null;
  const nextId = () => (id = (id + 1) & 0xFF);
  const need = async n => { while (buf.length < n) { const { value, done } = await rd.read(); if (done) throw 0; buf = buf.length ? cat(buf, value) : value; } };
  const readN = async n => { await need(n); const r = buf.subarray(0, n); buf = buf.subarray(n); return r; };
  const readLine = async () => { for (;;) { const i = buf.indexOf(10); if (i >= 0) { const l = dec.decode(buf.subarray(0, i)).replace(/\r$/, ''); buf = buf.subarray(i + 1); return l; } const { value, done } = await rd.read(); if (done) throw 0; buf = buf.length ? cat(buf, value) : value; } };
  const readPkt = async () => { const hd = await readN(4), l = u16(hd, 2) & 0x0FFF; return { ctrl: (hd[1] & 1) === 1, body: l > 4 ? await readN(l - 4) : E }; };
  const parseLink = d => {
    const o = d.length >= 2 && d[0] === 0xFF && d[1] === 0x03 ? 2 : 0; if (d.length - o < 4) return null; const pr = u16(d, o);
    if (pr === 0x0021) return { protocol: pr, ip: d.subarray(o + 2), raw: d.subarray(o) };
    return d.length - o < 6 ? null : { protocol: pr, code: d[o + 2], id: d[o + 3], payload: d.subarray(o + 6), raw: d.subarray(o) };
  };
  const establish = async () => {
    if (myIp) return myIp;
    const cred = atob('dnBu');
    const req = enc.encode(atob('U1NUUF9EVVBMRVhfUE9TVCAvc3JhX3tCQTE5NTk4MC1DRDQ5LTQ1OGItOUUyMy1DODRFRTBBRENENzV9LyBIVFRQLzEuMQ0KSG9zdDog') + h + atob('DQpDb250ZW50LUxlbmd0aDogMTg0NDY3NDQwNzM3MDk1NTE2MTUNClNTVFBDT1JSRUxBVElPTklEOiB7') + crypto.randomUUID() + atob('fQ0KDQo='));
    const mru = new Uint8Array([5, 220]);
    await wr.write(cat(req, tunCtrl(0x0001, [{ id: 1, data: new Uint8Array([0, 1]) }]), tunData(linkFrame(0xc021, 1, nextId(), [{ type: 1, data: mru }]))));
    const st = await readLine(); if (!st.includes('200')) throw 0; while ((await readLine()) !== '') {}
    let authed = false;
    for (let i = 0; i < 200 && !myIp; i++) {
      const pk = await readPkt();
      if (pk.ctrl) { if (pk.body.length >= 2 && u16(pk.body, 0) === 0x0008) await wr.write(tunCtrl(0x0009)); continue; }
      const pp = parseLink(pk.body); if (!pp) continue;
      if (pp.protocol === 0xc021) {
        if (pp.code === 1) {
          const a = new Uint8Array(pp.raw); a[2] = 2;
          if (!authed) { await wr.write(cat(tunData(a), tunData(authFrame(nextId(), cred, cred)))); authed = true; }
          else await wr.write(tunData(a));
        } else if (pp.code === 2) {
          if (!authed) { await wr.write(tunData(authFrame(nextId(), cred, cred))); authed = true; }
        } else if (pp.code === 9) { const a = new Uint8Array(pp.raw); a[2] = 10; await wr.write(tunData(a)); }
      } else if (pp.protocol === 0xc023 && pp.code === 2) {
        await wr.write(tunData(linkFrame(0x8021, 1, nextId(), [{ type: 3, data: new Uint8Array(4) }])));
      } else if (pp.protocol === 0x8021) {
        if (pp.code === 1) { const a = new Uint8Array(pp.raw); a[2] = 2; await wr.write(tunData(a)); }
        else if (pp.code === 3) { const o = findOpt(pp.payload, 3); if (o) await wr.write(tunData(linkFrame(0x8021, 1, nextId(), [{ type: 3, data: o }]))); }
        else if (pp.code === 2) { const o = findOpt(pp.payload, 3); if (o) { myIp = `${o[0]}.${o[1]}.${o[2]}.${o[3]}`; await wr.write(tunCtrl(0x0004, [{ id: 2, data: new Uint8Array(112) }])); } }
      }
    }
    if (!myIp) throw 0; return myIp;
  };
  return { sock, wr, rd, establish, readPkt, parseLink };
};

const resolveCandidates = (host, port) => {
  const origKey = `${host}:${port}`;
  const remapped = REMAP_HOST.get(origKey) || origKey;
  const backups = BACKUPS.get(remapped) || BACKUPS.get(origKey) || [];
  const cc = HOST_COUNTRY.get(remapped) || HOST_COUNTRY.get(origKey);
  const dyn = cc ? (livePoolByCountry.get(cc) || []) : [];
  const all = [remapped, ...backups, ...dyn];
  const uniq = [...new Set(all)];
  const aliveList = uniq.filter(hp => !isDead(hp));
  const list = aliveList.length ? aliveList : uniq;
  return list.map(hp => { const idx = hp.lastIndexOf(':'); return [hp.slice(0, idx), Number(hp.slice(idx + 1)), hp]; });
};

const establishFastTun = (host, port) => {
  const cands = resolveCandidates(host, port).slice(0, 3);
  return new Promise(resolve => {
    let settled = false, pending = cands.length;
    const done = () => { if (--pending <= 0 && !settled) { settled = true; resolve(null); } };
    cands.forEach(([h, p, hp], idx) => {
      const delay = idx === 0 ? 0 : idx === 1 ? 2200 : 3800;
      setTimeout(async () => {
        if (settled) return done();
        const tun = openTun(h, p);
        try {
          const vip = await Promise.race([tun.establish(), new Promise((_, j) => setTimeout(() => j(0), 4200))]);
          markAlive(hp);
          if (!settled) { settled = true; resolve({ tun, vip, h, p, hp }); } else { try { tun.sock.close(); } catch {} }
        } catch { markDead(hp); try { tun.sock.close(); } catch {} done(); }
      }, delay);
    });
  });
};

const makeTcp = (tun, vip, tIp, tPort) => {
  const sIp = new Uint8Array(vip.split('.').map(Number)), dIp = new Uint8Array(tIp.split('.').map(Number)), sp = 20000 + ((Math.random() * 40000) | 0);
  let seq = (Math.random() * 0xFFFFFFFF) >>> 0, ack = 0;
  const frame = (flags, data = E) => {
    const dl = data.length, tl = 20 + dl, il = 20 + tl, f = new Uint8Array(48 + dl), v = new DataView(f.buffer);
    f[0] = 0x10; f[2] = ((il + 8) >> 8) | 0x80; f[3] = (il + 8) & 0xFF; f[4] = 0xFF; f[5] = 0x03; f[6] = 0x00; f[7] = 0x21;
    f[8] = 0x45; v.setUint16(10, il); v.setUint16(12, (Math.random() * 65536) | 0); f[14] = 0x40; f[16] = 64; f[17] = 6;
    f.set(sIp, 20); f.set(dIp, 24); v.setUint16(18, csum(f.subarray(8, 28)));
    v.setUint16(28, sp); v.setUint16(30, tPort); v.setUint32(32, seq); v.setUint32(36, ack); f[40] = 0x50; f[41] = flags; v.setUint16(42, 65535);
    if (dl) f.set(data, 48);
    const ps = new Uint8Array(12 + tl), pv = new DataView(ps.buffer); ps.set(sIp, 0); ps.set(dIp, 4); ps[9] = 6; pv.setUint16(10, tl); ps.set(f.subarray(28), 12);
    v.setUint16(44, csum(ps)); return f;
  };
  const match = ipPkt => {
    if (ipPkt.length < 40 || (ipPkt[0] >> 4) !== 4 || ipPkt[9] !== 6) return null;
    const ihl = (ipPkt[0] & 0x0F) * 4; if (ipPkt.length < ihl + 20) return null;
    for (let i = 0; i < 4; i++) if (ipPkt[12 + i] !== dIp[i]) return null;
    if (u16(ipPkt, ihl) !== tPort || u16(ipPkt, ihl + 2) !== sp) return null;
    const doff = (ipPkt[ihl + 12] >> 4) * 4, ipLen = Math.min(ipPkt.length, u16(ipPkt, 2));
    return { seq: u32(ipPkt, ihl + 4), flags: ipPkt[ihl + 13], payload: ipLen > ihl + doff ? ipPkt.subarray(ihl + doff, ipLen) : E };
  };
  const buildSend = data => {
    const out = [];
    for (let o = 0; o < data.length; o += 1300) { const ch = data.subarray(o, Math.min(o + 1300, data.length)); out.push(frame(0x18, ch)); seq = (seq + ch.length) >>> 0; }
    return out.length ? cat(...out) : E;
  };
  const handshake = async (init = E) => {
    await tun.wr.write(frame(0x02)); seq = (seq + 1) >>> 0;
    for (let r = 0; r < 400; r++) {
      const pk = await tun.readPkt();
      if (pk.ctrl) { if (pk.body.length >= 2 && u16(pk.body, 0) === 0x0008) await tun.wr.write(tunCtrl(0x0009)); continue; }
      const pp = tun.parseLink(pk.body); if (!pp) continue;
      if (pp.protocol === 0xc021 && pp.code === 9) { const a = new Uint8Array(pp.raw); a[2] = 10; await tun.wr.write(tunData(a)); continue; }
      if (pp.protocol !== 0x0021) continue;
      const m = match(pp.ip); if (!m || (m.flags & 0x12) !== 0x12) continue;
      ack = (m.seq + 1) >>> 0;
      const ackFrame = frame(0x10);
      await tun.wr.write(init.length ? cat(ackFrame, buildSend(init)) : ackFrame);
      return;
    }
    throw 0;
  };
  const send = async data => {
    const pkt = buildSend(data);
    if (pkt.length) await tun.wr.write(pkt);
  };
  const sendAck = async () => { await tun.wr.write(frame(0x10)); };
  return { handshake, send, sendAck, match, get ack() { return ack; }, set ack(v) { ack = v >>> 0; } };
};

const tunConn = async (host, port, tHost, tPort, init = E, preTun = null) => {
  const tIpPromise = resolveIP(tHost);
  const tryWithTun = async (tun, vip, tIp) => {
    const tcp = makeTcp(tun, vip, tIp, tPort);
    await Promise.race([tcp.handshake(init), new Promise((_, j) => setTimeout(() => j(new Error('tcp_timeout')), 3400))]);
    return { tun, tcp };
  };
  const tryFresh = async (h, p, hp, tIp) => {
    const tun = openTun(h, p);
    try {
      const vip = await Promise.race([tun.establish(), new Promise((_, j) => setTimeout(() => j(new Error('t_timeout')), 4200))]);
      const res = await tryWithTun(tun, vip, tIp);
      markAlive(hp);
      return res;
    } catch (e) { markDead(hp); try { tun.sock.close(); } catch {} throw e; }
  };
  const [w, tIp] = await Promise.all([preTun ? preTun : Promise.resolve(null), tIpPromise]);
  if (w && w.tun && w.vip) {
    try { return await tryWithTun(w.tun, w.vip, tIp); }
    catch { markDead(w.hp); try { w.tun.sock.close(); } catch {} }
  }
  const cands = resolveCandidates(host, port);
  for (const [h, p, hp] of cands.slice(0, 2)) {
    if (w && w.hp === hp) continue;
    try { return await tryFresh(h, p, hp, tIp); } catch {}
  }
  throw new Error('All gateways failed');
};

const parseHdr = b => {
  if (b.length < 24) return null;
  const ver = b[0], al = b[17], cmd = b[18 + al];
  if (cmd !== 1 && cmd !== 2) return null;
  let o = 19 + al; const port = u16(b, o); o += 2; const at = b[o++]; let host = '';
  if (at === 1) { host = `${b[o]}.${b[o + 1]}.${b[o + 2]}.${b[o + 3]}`; o += 4; }
  else if (at === 2) { const l = b[o++]; host = dec.decode(b.subarray(o, o + l)); o += l; }
  else if (at === 3) { const p = []; for (let i = 0; i < 8; i++) p.push(u16(b, o + i * 2).toString(16)); host = p.join(':'); o += 16; }
  return { ver, cmd, host, port, raw: b.subarray(o) };
};

const b64ToU8 = s => { try { const b = atob(s.replace(/-/g, '+').replace(/_/g, '/')), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; } catch { return E; } };

const probeGw = async (host, port) => {
  const t0 = Date.now(), tun = openTun(host, port);
  try {
    const vip = await Promise.race([tun.establish(), new Promise((_, j) => setTimeout(() => j(new Error('timeout')), 4500))]);
    return { ok: true, host, port, vip, ms: Date.now() - t0 };
  } catch (e) { return { ok: false, host, port, err: String(e.message || e), ms: Date.now() - t0 }; }
  finally { try { tun.sock.close(); } catch {} }
};

const buildSub = async (url, raw, env) => {
  await loadEntriesFromKv(env);
  const entries = liveEntries.length ? liveEntries : FALLBACK_ENTRIES;
  const host = url.hostname || HOST_DOMAIN;
  const pre = atob('dmxlc3M6Ly8=');
  const links = [];
  let ei = 0;
  for (const n of NODES) {
    const [h, p] = resolveCandidates(n.host, n.port)[0];
    const path = encodeURIComponent(`/s/${h}:${p}?ed=2560`);
    const name = encodeURIComponent(`${n.cc} ${n.name} [Score:${n.fraud}]`);
    const entry = entries[ei % entries.length]; ei++;
    links.push(`${pre}${ID}@${entry}?security=tls&type=ws&host=${host}&fp=chrome&sni=${host}&path=${path}&fragment=1%2C40-60%2C30-50%2Ctlshello&encryption=none&alpn=#${name}`);
  }
  const body = links.join('\n');
  return new Response(raw ? body : btoa(unescape(encodeURIComponent(body))), { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'Access-Control-Allow-Origin': '*' } });
};

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      await refreshLivePool();
      await refreshEntriesSoft(env);
    })());
  },
  async fetch(req, env, ctx) {
    ctx?.waitUntil?.(refreshLivePool());
    const url = new URL(req.url);
    if (url.pathname === `/sub-${SUB_TOKEN}`) return buildSub(url, url.searchParams.get('raw') === '1', env);
    if (url.pathname === `/json-${SUB_TOKEN}`) {
      await loadEntriesFromKv(env);
      return Response.json({ service: 'home-edge-gw', countries: [...new Set(NODES.map(n => n.country))].length, count: NODES.length, entries: liveEntries, entriesMeta, deadCount: deadHosts.size, activeNodes: NODES });
    }
    if (url.pathname === `/entries-${SUB_TOKEN}`) {
      if (req.method === 'GET') {
        await loadEntriesFromKv(env);
        return Response.json({ entries: liveEntries, meta: entriesMeta });
      }
      if (req.method === 'PUT' || req.method === 'POST') {
        const text = await req.text();
        const parsed = parseEntriesPayload(text);
        if (!parsed) return Response.json({ ok: false, err: 'bad entries' }, { status: 400 });
        const note = (url.searchParams.get('note') || 'manual').slice(0, 64);
        const saved = await saveEntriesToKv(env, parsed, note);
        return Response.json({ ok: true, saved, count: parsed.length, entries: parsed, meta: entriesMeta });
      }
      return new Response('method', { status: 405 });
    }
    if (url.pathname === `/probe-${SUB_TOKEN}`) {
      const h = url.searchParams.get('host');
      if (h) return Response.json(await probeGw(h, +(url.searchParams.get('port') || 443)));
      const targets = (url.searchParams.get('targets') || '').split(',').filter(Boolean);
      const list = targets.length ? targets.map(t => { const [th, tp] = t.split(':'); return { host: th, port: +(tp || 443) }; }) : NODES;
      const res = await Promise.all(list.map(n => probeGw(n.host, n.port)));
      return Response.json({ alive: res.filter(r => r.ok), all: res });
    }
    if (req.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
      return new Response('ok', { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8' } });
    }
    const targetTun = getTun(req.url);
    const [sH, sP] = [targetTun.host, targetTun.port];
    const [client, ws] = Object.values(new WebSocketPair());
    ws.accept();
    const preTun = establishFastTun(sH, sP);
    const edHdr = req.headers.get(atob('c2VjLXdlYnNvY2tldC1wcm90b2NvbA==')) || '';
    const edBuf = edHdr ? b64ToU8(edHdr.split(',')[0].trim()) : E;
    let tcpSession = null, dnsHandler = null, closed = false, pending = [];
    const closeAll = () => { if (closed) return; closed = true; try { ws.close(); } catch {} try { tcpSession?.tun.sock.close(); } catch {} };
    const handleFirst = async chunk => {
      const v = parseHdr(chunk); if (!v) return closeAll();
      const hdr = new Uint8Array([v.ver, 0]);
      if (v.cmd === 2) {
        preTun.then(w => { try { w?.tun?.sock?.close(); } catch {} }).catch(() => {});
        ws.send(hdr);
        dnsHandler = async d => {
          if (d.length <= 2) return;
          const q = d.subarray(2, 2 + u16(d, 0));
          const res = new Uint8Array(await fetch(atob('aHR0cHM6Ly8xLjEuMS4xL2Rucy1xdWVyeQ=='), { method: 'POST', headers: { 'content-type': atob('YXBwbGljYXRpb24vZG5zLW1lc3NhZ2U=') }, body: q }).then(r => r.arrayBuffer()));
          ws.send(cat(new Uint8Array([res.length >> 8, res.length & 0xff]), res));
        };
        if (v.raw.length > 2) await dnsHandler(v.raw);
        for (const p of pending) await dnsHandler(p);
        pending = [];
        return;
      }
      try {
        tcpSession = await tunConn(sH, sP, v.host, v.port, v.raw, preTun);
        ws.send(hdr);
        for (const p of pending) await tcpSession.tcp.send(p);
        pending = [];
        (async () => {
          const ooo = new Map();
          try {
            for (;;) {
              const pk = await tcpSession.tun.readPkt();
              if (pk.ctrl) { if (pk.body.length >= 2 && u16(pk.body, 0) === 0x0008) await tcpSession.tun.wr.write(tunCtrl(0x0009)); continue; }
              const pp = tcpSession.tun.parseLink(pk.body); if (!pp) continue;
              if (pp.protocol === 0xc021 && pp.code === 9) { const a = new Uint8Array(pp.raw); a[2] = 10; await tcpSession.tun.wr.write(tunData(a)); continue; }
              if (pp.protocol !== 0x0021) continue;
              const m = tcpSession.tcp.match(pp.ip); if (!m) continue;
              if (m.flags & 0x04) { closeAll(); break; }
              const d = m.payload;
              if (d.length > 0) {
                const diff = (m.seq - tcpSession.tcp.ack) | 0;
                const chunks = [];
                if (diff === 0) {
                  tcpSession.tcp.ack = (tcpSession.tcp.ack + d.length) >>> 0;
                  chunks.push(new Uint8Array(d));
                  while (ooo.has(tcpSession.tcp.ack)) {
                    const nd = ooo.get(tcpSession.tcp.ack);
                    ooo.delete(tcpSession.tcp.ack);
                    tcpSession.tcp.ack = (tcpSession.tcp.ack + nd.length) >>> 0;
                    chunks.push(nd);
                  }
                } else if (diff < 0 && diff + d.length > 0) {
                  const nd = d.subarray(-diff);
                  tcpSession.tcp.ack = (tcpSession.tcp.ack + nd.length) >>> 0;
                  chunks.push(new Uint8Array(nd));
                } else if (diff > 0 && ooo.size < 32) {
                  ooo.set(m.seq, new Uint8Array(d));
                }
                await tcpSession.tcp.sendAck();
                if (chunks.length) ws.send(chunks.length === 1 ? chunks[0] : cat(...chunks));
              }
              if (m.flags & 0x01) { tcpSession.tcp.ack = (tcpSession.tcp.ack + 1) >>> 0; await tcpSession.tcp.sendAck(); closeAll(); break; }
            }
          } catch { closeAll(); }
        })();
      } catch { closeAll(); }
    };
    let initStarted = false;
    if (edBuf.length > 0) { initStarted = true; handleFirst(edBuf); }
    ws.addEventListener('message', async ev => {
      const d = new Uint8Array(ev.data);
      if (!initStarted) { initStarted = true; await handleFirst(d); }
      else if (dnsHandler) { try { await dnsHandler(d); } catch { closeAll(); } }
      else if (tcpSession) { try { await tcpSession.tcp.send(d); } catch { closeAll(); } }
      else pending.push(d);
    });
    ws.addEventListener('close', closeAll); ws.addEventListener('error', closeAll);
    return new Response(null, { status: 101, webSocket: client });
  }
};
