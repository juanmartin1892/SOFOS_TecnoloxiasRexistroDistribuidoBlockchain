import socket
import argparse
import time
import json

# Default list of important security ports to check
IMPORTANT_PORTS = [22, 80, 443, 3389, 21, 25, 110, 143, 3306, 5432, 6379]

def check_port(host, port):
    """
    Check if a specific port is open on a given host.
    
    Args:
        host (str): The target host.
        port (int): The port to check.
    
    Returns:
        dict: Information about the port status.
    """
    report = {
        "port": port,
        "status": "closed",
        "latency": None
    }
    try:
        start_time = time.time()
        with socket.create_connection((host, port), timeout=2) as sock:
            latency = round((time.time() - start_time) * 1000, 2)  # Measure latency in ms
            report["status"] = "open"
            report["latency"] = latency
    except (socket.timeout, ConnectionRefusedError):
        report["status"] = "closed"
    except Exception as e:
        report["status"] = f"error: {str(e)}"
    return report

def generate_report(host, ports):
    """
    Generate a report of port statuses for a host.
    
    Args:
        host (str): The target host.
        ports (list): List of ports to check.
    
    Returns:
        dict: Report containing the results.
    """
    report = {
        "host": host,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "results": []
    }
    for port in ports:
        result = check_port(host, port)
        report["results"].append(result)
    return report

def save_report(report, filename="security_ports_report.json"):
    """
    Save the generated report to a JSON file.
    
    Args:
        report (dict): The report to save.
        filename (str): Name of the file.
    """
    with open(filename, "w") as f:
        json.dump(report, f, indent=4)

def main():
    # Parse input arguments
    parser = argparse.ArgumentParser(description="Check if important security ports are open on a host.")
    parser.add_argument("host", type=str, help="The target host (e.g., example.com or 192.168.1.1).")
    parser.add_argument("port", type=int, help="Add a specific port to the list of ports to check.")

    args = parser.parse_args()

    # Add the additional port to the list if provided
    ports_to_check = IMPORTANT_PORTS
    if args.port:
        if args.port not in ports_to_check:
            ports_to_check.append(args.port)

    # Generate the report
    report = generate_report(args.host, ports_to_check)
    
    # Print the report to the console
    print(json.dumps(report, indent=4))
    
    # Save the report to a file
    save_report(report)

if __name__ == "__main__":
    main()
