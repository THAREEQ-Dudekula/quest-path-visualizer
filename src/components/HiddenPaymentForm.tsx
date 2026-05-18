import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const HiddenPaymentForm = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const [lateFee, setLateFee] = useState("9000");
  const [semesterType, setSemesterType] = useState<"odd" | "even">("even");
  const [lateChecked] = useState(true); // always checked, never unchecked

  if (!open) return null;

  const handleNext = () => {
    const fee = parseInt(lateFee, 10) || 0;
    navigate("/gpay", {
      state: {
        lateFee: fee,
        lateChecked: true,
        semesterType,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">Payment Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Late Fee Amount (₹)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lateChecked}
                readOnly
                className="w-4 h-4 accent-emerald-600 cursor-not-allowed"
              />
              <input
                type="number"
                value={lateFee}
                onChange={(e) => setLateFee(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-emerald-500"
                placeholder="Enter late fee"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester Type
            </label>
            <select
              value={semesterType}
              onChange={(e) => setSemesterType(e.target.value as "odd" | "even")}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-emerald-500 bg-white"
            >
              <option value="odd">Odd Semester</option>
              <option value="even">Even Semester</option>
            </select>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiddenPaymentForm;
