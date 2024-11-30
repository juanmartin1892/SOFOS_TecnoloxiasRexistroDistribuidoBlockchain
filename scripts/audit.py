import asyncio
import time
import argparse
import random
import uuid

async def audit_host(audit):
    """
    Audits a host and port for connectivity and latency.
    
    Args:
        audit (dict): Dictionary containing 'id', 'host', and 'port'.
    
    Returns:
        dict: Report with audit results.
    """
    report = {
        "id": audit["id"],
        "host": audit["host"],
        "port": audit["port"],
        "timestamp": int(time.time() * 1000),
        "latency": 0,
        "connected": False,
    }

    start = time.time()

    try:
        # Open a connection to the host and port
        reader, writer = await asyncio.open_connection(audit["host"], audit["port"])
        
        # Calculate latency
        report["latency"] = int((time.time() - start) * 1000)
        report["connected"] = True
        
        # Close the connection
        writer.close()
        await writer.wait_closed()

    except Exception as e:
        # Handle connection errors
        report["connected"] = False

    return report

async def main():
    # Parse input arguments
    parser = argparse.ArgumentParser(description="Audit a host and port for connectivity.")
    parser.add_argument("host", type=str, help="The host to audit (e.g., example.com).")
    parser.add_argument("port", type=int, help="The port to audit (e.g., 80).")
    args = parser.parse_args()

    unique_id = uuid.uuid4()
    
    # Create audit object
    audit = {"id": unique_id, "host": args.host, "port": args.port}
    
    # Perform audit
    report = await audit_host(audit)
    print(report)

if __name__ == "__main__":
    asyncio.run(main())