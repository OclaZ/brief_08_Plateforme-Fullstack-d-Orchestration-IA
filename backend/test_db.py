import asyncio, asyncpg

async def main():
    try:
        conn = await asyncpg.connect(
            user="neondb_owner",
            password="npg_Yi8JtIRz0WHl",
            database="neondb",
            host="ep-flat-king-ag3z1yl7-pooler.c-2.eu-central-1.aws.neon.tech",
            port=5432,
            ssl=True,
            timeout=10
        )
        print("Connected OK!")
        await conn.close()
    except Exception as e:
        print("FAILED:", e)

asyncio.run(main())
