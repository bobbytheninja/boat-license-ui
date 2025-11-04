// src/components/AdminPage.jsx
import React, { useState } from "react";
import Page from "./ui/Page.jsx";
import Card from "./ui/Card.jsx";
import TopBar from "./TopBar.jsx";
import { setImportedQuestions } from "./data.js";
import Papa from "papaparse";

export default function AdminPage({ onNav }) {
  const [fileIssues, setFileIssues] = useState([]);
  const [hasErrors, setHasErrors] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);
  const [info, setInfo] = useState("");

  function validateRows(rows) {
    const issues = [];
    rows.forEach((r, i) => {
      if (!r.id || !r.category || !r.text) {
        issues.push(`Row ${i + 2}: missing id/category/text`);
      }
      const w = Number(r.weight);
      if (![1, 2, 3].includes(w)) {
        issues.push(`Row ${i + 2}: invalid weight "${r.weight}" (must be 1/2/3)`);
      }
      const c = String(r.correct || "").toLowerCase();
      if (!["a", "b", "c", "d"].includes(c)) {
        issues.push(`Row ${i + 2}: invalid correct "${r.correct}" (must be a/b/c/d)`);
      }
      ["optionA", "optionB", "optionC", "optionD"].forEach((k) => {
        if (typeof r[k] === "undefined") {
          issues.push(`Row ${i + 2}: missing ${k}`);
        }
      });
    });
    return issues;
  }

  function onUploadFile(evt) {
    const file = evt.target.files?.[0];
    if (!file) return;

    setInfo("");
    setFileIssues([]);
    setParsedRows([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = Array.isArray(results.data) ? results.data : [];
        const issues = validateRows(rows);
        setParsedRows(rows);
        setFileIssues(issues);
        setHasErrors(issues.length > 0);
        if (!rows.length) {
          setInfo("No rows detected. Check your CSV headers & content.");
        } else {
          setInfo(`Loaded ${rows.length} rows.`);
        }
      },
      error: (err) => {
        setInfo("Failed to parse CSV: " + err?.message);
        setFileIssues([err?.message || "Unknown parse error"]);
        setHasErrors(true);
      },
    });
  }

  function onProceed() {
    if (!parsedRows.length) {
      alert("No rows to import. Please upload a valid CSV first.");
      return;
    }
    const count = setImportedQuestions(parsedRows);
    if (count > 0) {
      alert(`✅ Import successful — ${count} questions saved.\nYou can now start a Small Boat exam.`);
    } else {
      alert("No valid questions were found to import. Please check your CSV.");
    }
  }

  return (
    <Page>
      <TopBar onNav={onNav} current="admin" />

      <Card className={hasErrors ? "border-red-400" : ""}>
        <div className="p-5">
          <h2 className="text-2xl font-bold">Admin — Upload Questions (CSV)</h2>
          <p className="text-neutral-600 text-sm mt-1">
            Required headers: <code>id, category, text, weight, correct, isMock, optionA, optionB, optionC, optionD, image, language</code>
          </p>
          <div className="mt-3">
            <input type="file" accept=".csv" onChange={onUploadFile} className="block" />
          </div>

          {info && <div className="mt-2 text-sm text-neutral-700">{info}</div>}

          {fileIssues.length > 0 && (
            <div className="mt-3 p-3 rounded-2xl bg-red-50 border border-red-300 text-sm">
              <div className="font-semibold mb-1">Validation issues</div>
              <ul className="list-disc ml-5 space-y-1">
                {fileIssues.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
              <div className="mt-2 text-xs text-red-700">
                You may continue — missing 3-pt questions will be filled by lower weights automatically during composition.
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={onProceed}
              className="px-3 py-2 rounded-full bg-neutral-900 text-white"
            >
              Proceed & Import
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("importedQuestions:v1");
                alert("Cleared imported questions from local storage.");
              }}
              className="px-3 py-2 rounded-full border bg-white"
            >
              Clear Imported
            </button>
          </div>
        </div>
      </Card>
    </Page>
  );
}