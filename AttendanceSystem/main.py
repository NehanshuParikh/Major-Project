from flask import Flask, request, jsonify, send_file, after_this_request
from threading import Thread
import cv2
from pyzbar.pyzbar import decode
import openpyxl
from datetime import datetime
import winsound
from flask_cors import CORS
import os
import threading
import time

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Initialize or create an Excel file for a subject
def initialize_excel(subject):
    excel_file = f"{subject}.xlsx"
    try:
        workbook = openpyxl.load_workbook(excel_file)
    except FileNotFoundError:
        workbook = openpyxl.Workbook()
        sheet = workbook.active
        sheet.title = "Attendance"
        sheet.append(["User Type", "Enrollment", "Date", "Time"])
        workbook.save(excel_file)
    return excel_file

# Update attendance in the Excel file
def mark_attendance(barcode_data, name, subject):
    excel_file = initialize_excel(subject)
    workbook = openpyxl.load_workbook(excel_file)
    sheet = workbook["Attendance"]
    current_date = datetime.now().strftime("%Y-%m-%d")
    current_time = datetime.now().strftime("%H:%M:%S")

    # Check if entry already exists for the same date
    for row in sheet.iter_rows(min_row=2, values_only=True):
        if row[1] == barcode_data and row[2] == current_date:
            return False  # Entry already exists

    # Add new entry
    sheet.append([name, barcode_data, current_date, current_time])
    workbook.save(excel_file)
    return True

# Barcode scanning function that runs in a separate thread
def scan_barcode_in_thread(subject):
    def scan_barcode():
        cap = cv2.VideoCapture(0)  # Open the webcam
        while True:
            ret, frame = cap.read()
            if not ret:
                continue
            for barcode in decode(frame):
                barcode_data = barcode.data.decode('utf-8')
                # Mark attendance
                if mark_attendance(barcode_data, "Student", subject):
                    winsound.Beep(1000, 200)  # Success beep
                else:
                    winsound.Beep(500, 200)  # Failure beep
            cv2.imshow("Barcode Scanner", frame)  # Display the video frame
            if cv2.waitKey(1) & 0xFF == ord('q'):  # Press 'q' to quit
                break
        cap.release()  # Release the webcam
        cv2.destroyAllWindows()  # Close the OpenCV window

    # Start scanning in a separate thread
    Thread(target=scan_barcode, daemon=True).start()

# API endpoint to start attendance scanning
@app.route('/start-attendance', methods=['POST'])
def start_attendance():
    data = request.json
    subject = data.get("subject")
    
    if subject:
        # Start barcode scanning in a background thread
        scan_barcode_in_thread(subject)
        return jsonify({"message": "Barcode scanning started!", "status": "success"})
    else:
        return jsonify({"message": "Subject is required!", "status": "error"}), 400



@app.route('/download-excel', methods=['GET'])
def download_excel():
    try:
        subject = request.args.get('subject')  # Retrieve subject from query parameter
        if not subject:
            return jsonify({"message": "Subject name is required."}), 400

        # Sanitize the subject name
        sanitized_subject = ''.join(c if c.isalnum() or c in " _-" else '_' for c in subject)

        # Construct the file path
        file_path = os.path.join(BASE_DIR, f"{sanitized_subject}.xlsx")

        # Debugging: Print the file path being fetched
        print(f"Fetching file for download: {file_path}")

        # Debugging: List all files in the directory
        folder_path = os.path.dirname(file_path)
        files_in_folder = os.listdir(folder_path)
        print(f"Files in directory '{folder_path}': {files_in_folder}")

        # Check if the file exists
        if not os.path.exists(file_path):
            return jsonify({"message": f"File for subject '{sanitized_subject}' not found."}), 404

        # Send the file to the client
        response = send_file(file_path, as_attachment=True, download_name=f"{sanitized_subject}.xlsx")

        # Delay deletion for a brief time to ensure file has been released
        def delete_file_after_response():
            print(f"Attempting to delete file after delay: {file_path}")
            time.sleep(2)  # Wait 2 seconds before trying to delete the file
            try:
                os.remove(file_path)
                print(f"File {file_path} deleted successfully.")
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")

        # Start the file deletion in a new thread
        threading.Thread(target=delete_file_after_response).start()

        return response

    except Exception as e:
        return jsonify({"message": f"Error downloading file: {str(e)}"}), 500
# Run the Flask app
if __name__ == '__main__':
    app.run(port=5001, threaded=True, debug=True)
