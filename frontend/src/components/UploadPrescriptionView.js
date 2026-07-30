"use client";

import React, { useState } from "react";

export default function UploadPrescriptionView() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState("Downtown Pharmacy");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setSelectedFile(null);
      setDoctorNotes("");
    }, 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Upload Doctor's Prescription
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Upload your prescription for manual review by our licensed branch pharmacists.
        </p>
      </div>

      {/* Upload Notification Toast */}
      {uploadSuccess && (
        <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-lg border border-emerald-700 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>✅ Prescription uploaded successfully! Sent to {selectedPharmacy} pharmacist queue for review.</span>
          <span className="text-[10px] bg-emerald-800 px-2 py-1 rounded">Pending Review</span>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-5 text-xs">
        
        {/* Branch Selection */}
        <div>
          <label className="block text-slate-700 font-bold mb-1.5">
            Select Fulfilling Pharmacy Branch
          </label>
          <select
            value={selectedPharmacy}
            onChange={(e) => setSelectedPharmacy(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Downtown Pharmacy">Downtown Pharmacy - 104 Healthcare Blvd</option>
            <option value="Uptown Pharmacy">Uptown Pharmacy - 789 Metro Plaza</option>
            <option value="Westside Pharmacy">Westside Pharmacy - 550 West End Street</option>
          </select>
        </div>

        {/* Upload Box */}
        <div>
          <label className="block text-slate-700 font-bold mb-1.5">
            Upload Prescription Image / File (JPG, PNG, PDF)
          </label>
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative cursor-pointer">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200 shadow-xs">
              📄
            </div>
            {selectedFile ? (
              <div>
                <p className="font-bold text-slate-900">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB • Click to change</p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-slate-800">Click or drag prescription file here</p>
                <p className="text-[11px] text-slate-400 mt-1">Supports clear photo of physical prescription or digital PDF</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-slate-700 font-bold mb-1.5">
            Additional Patient Notes / Dosage Instructions (Optional)
          </label>
          <textarea
            rows="3"
            placeholder="e.g. Please dispense 30-day supply of Amoxicillin as specified by Dr. Kumar."
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Safety Gate Warning */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-emerald-900 leading-relaxed flex items-start gap-2.5">
          <span className="text-base">🛡️</span>
          <div>
            <span className="font-bold">Pharmacist Safety Gate:</span> Prescription-required items will not be dispensed or packed until our licensed pharmacist manually inspects and verifies your upload.
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedFile}
          className={`w-full py-3 text-xs font-bold rounded-xl transition-all shadow-xs ${
            selectedFile
              ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          Submit Prescription for Pharmacist Review →
        </button>
      </form>
    </div>
  );
}
