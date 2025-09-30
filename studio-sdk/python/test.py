import os
from studio_sdk import LinTO
import asyncio


async def main() -> None:

    token = os.getenv("STUDIO_TOKEN")
    file_path = os.getenv("FILE_PATH")

    linTO = LinTO(token, base_url="http://127.0.0.1:8001", api_path="api")

    with open(file_path, "rb") as f:
        file = f.read()

    handle = await linTO.transcribe(file)


if __name__ == '__main__':
    asyncio.run(main())

# def on_update(data):
#     print("update", data)


# def on_done(data):
#     print("done", data)


# def on_error(data):
#     print("error", data)


# handle.add_event_listener("update", on_update)
# handle.add_event_listener("done", on_done)
# handle.add_event_listener("error", on_error)

# # Keep the program running to receive events
# try:
#     while True:
#         pass
# except KeyboardInterrupt:
#     handle.stop()
