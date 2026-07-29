"use client";

import { useState, useRef, useEffect } from "react";

export default function PrescriptionsView() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [rxNotes, setRxNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const [prescriptions, setPrescriptions] = useState([
    {
      id: "rx-1",
      title: "Amoxicillin 500mg (Antibiotic)",
      doctor: "Dr. Smith",
      refillsLeft: 2,
      status: "Valid",
      statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      dateAdded: "July 20, 2026",
    },
    {
      id: "rx-2",
      title: "Lisinopril 10mg (Blood Pressure)",
      doctor: "Dr. Adams",
      refillsLeft: 5,
      status: "Valid",
      statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      dateAdded: "July 15, 2026",
    },
  ]);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please allow camera permissions in your browser.");
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const capturedFile = new File(
            [blob],
            `prescription_scan_${Date.now()}.jpg`,
            { type: "image/jpeg" }
          );
          handleFileSelect(capturedFile);
          stopCamera();
          if (!showUploadModal) {
            setShowUploadModal(true);
          }
        }
      },
      "image/jpeg",
      0.9
    );
  };

  // Clean up camera stream if component unmounts
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newRx = {
        id: `rx-${Date.now()}`,
        title: selectedFile.name.replace(/\.[^/.]+$/, ""),
        doctor: doctorName || "Scanned Prescription",
        refillsLeft: 1,
        status: "Pending Verification",
        statusColor: "bg-amber-100 text-amber-800 border-amber-200",
        dateAdded: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      setPrescriptions([newRx, ...prescriptions]);
      setIsSubmitting(false);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadModal(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setDoctorName("");
        setRxNotes("");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Prescriptions</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Scan & upload a photo of your prescription for instant pharmacy fulfillment
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Live Camera Scanner Button */}
          <button
            onClick={startCamera}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Open Camera</span>
          </button>

          {/* Upload File Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0b193c] hover:bg-[#13285c] text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="divide-y divide-slate-100">
        {prescriptions.map((rx) => (
          <div key={rx.id} className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">{rx.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Prescribed by {rx.doctor} • Added {rx.dateAdded} • Refills left: {rx.refillsLeft}
                </p>
              </div>
            </div>

            <span className={`px-3 py-1 text-xs font-bold rounded-full border shrink-0 ${rx.statusColor}`}>
              {rx.status}
            </span>
          </div>
        ))}
      </div>

      {/* 📷 LIVE CAMERA VIEWFINDER MODAL */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-lg overflow-hidden flex flex-col items-center relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="w-full bg-slate-950/80 px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-sm font-bold text-white tracking-wide">Live Camera Viewfinder</span>
              </div>
              <button
                onClick={stopCamera}
                className="text-slate-400 hover:text-white text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Video Viewfinder Feed */}
            <div className="w-full h-80 bg-black relative flex items-center justify-center overflow-hidden">
              {cameraError ? (
                <div className="p-6 text-center text-rose-400 text-xs space-y-2">
                  <p className="font-semibold text-sm">Camera Unavailable</p>
                  <p>{cameraError}</p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  ></video>
                  {/* Framing Overlay Guide */}
                  <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
                    <span className="text-[11px] font-semibold text-white/70 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      Align Prescription Photo Here
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Capture Action Bar */}
            <div className="w-full p-6 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              {!cameraError && (
                <button
                  onClick={capturePhoto}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-white bg-white/30"></div>
                  <span>📸 Capture Prescription</span>
                </button>
              )}

              <div></div>
            </div>
          </div>
        </div>
      )}

      {/* 📄 UPLOAD PRESCRIPTION MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0b193c] px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Scan & Upload Prescription</h3>
                  <p className="text-xs text-slate-300">Upload a clear photo or document of your doctor's Rx</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-300 hover:text-white text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-5">
              {uploadSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">Prescription Uploaded!</h4>
                  <p className="text-xs text-slate-500">
                    Your prescription photo has been submitted for pharmacy verification.
                  </p>
                </div>
              ) : (
                <>
                  {/* File Upload / Camera Drag-Drop Box */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
                      isDragging
                        ? "border-[#0b193c] bg-blue-50/50"
                        : selectedFile
                        ? "border-emerald-300 bg-emerald-50/30"
                        : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
                    }`}
                  >
                    {previewUrl ? (
                      <div className="space-y-3">
                        <img
                          src={previewUrl}
                          alt="Prescription preview"
                          className="max-h-44 mx-auto rounded-xl shadow-md border border-slate-200 object-contain"
                        />
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                          <span className="font-semibold">{selectedFile.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                            }}
                            className="text-rose-600 hover:underline font-semibold ml-2 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : selectedFile ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-lg font-bold">
                          📄
                        </div>
                        <p className="text-sm font-semibold text-slate-800">{selectedFile.name}</p>
                        <p className="text-xs text-slate-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                        >
                          Change File
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0b193c] flex items-center justify-center mx-auto shadow-inner">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Drag & drop your prescription image here
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Supports JPG, PNG, WEBP or PDF (Max 10MB)
                          </p>
                        </div>

                        {/* Dual Action Buttons: File Picker & Live Camera Viewfinder */}
                        <div className="flex items-center justify-center gap-3 pt-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition cursor-pointer"
                          >
                            📁 Browse File
                          </button>

                          <button
                            type="button"
                            onClick={startCamera}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                          >
                            📷 Open Camera
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Doctor Name & Instructions */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                        Prescribing Doctor Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Robert Vance"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                        Special Notes for Pharmacist (Optional)
                      </label>
                      <textarea
                        rows="2"
                        placeholder="e.g. Please provide generic brand if available"
                        value={rxNotes}
                        onChange={(e) => setRxNotes(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0b193c]/50 text-sm font-medium text-slate-800"
                      ></textarea>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedFile || isSubmitting}
                      className="px-6 py-2.5 bg-[#0b193c] hover:bg-[#13285c] disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <span>Submit Prescription</span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
