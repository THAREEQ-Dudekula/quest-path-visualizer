import { useEffect, useState } from "react";
import { X, CreditCard, Smartphone, Landmark, ChevronDown, Search, ShieldCheck, Globe } from "lucide-react";

type Method = "credit" | "debit" | "upi" | "netbanking";

interface Props {
  open: boolean;
  onClose: () => void;
  baseAmount: number;
}

const banks = ["Axis Bank", "Federal Bank", "HDFC Bank", "ICICI Bank", "Kotak Bank", "SBI Bank"];

const EasebuzzModal = ({ open, onClose, baseAmount }: Props) => {
  const [method, setMethod] = useState<Method>("credit");
  const [seconds, setSeconds] = useState(15 * 60);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSeconds(15 * 60);
    setMethod("credit");
    setSelectedBank(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [open]);

  if (!open) return null;

  // platform charges per method (mock, like screenshots)
  const charges =
    method === "credit" ? 1302.44 :
    method === "debit" ? 41.30 :
    method === "upi" ? 84.97 : 29.50;

  const totalPay = baseAmount + charges;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const formatINR = (n: number) =>
    n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const methods: { key: Method; label: string; icon: typeof CreditCard; sub?: string; badges: string[] }[] = [
    { key: "credit", label: "Credit Card", icon: CreditCard, sub: "1 Offer Available", badges: ["RuPay", "MC", "VISA"] },
    { key: "debit", label: "Debit Card", icon: CreditCard, badges: ["RuPay", "MC", "VISA"] },
    { key: "upi", label: "UPI", icon: Smartphone, sub: "2 Offer Available", badges: ["GPay", "PTM", "BHIM", "+2"] },
    { key: "netbanking", label: "NetBanking", icon: Landmark, badges: ["SBI", "ICI", "KTK"] },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-[#1a1f6b] via-[#3b3fa3] to-[#6d4ee0] text-white p-5 relative">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onClose} className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-2 py-1 rounded">
              <X className="w-4 h-4" /> Cancel
            </button>
            <div className="flex items-center gap-1 text-sm">
              <Globe className="w-4 h-4" /> English <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white grid place-items-center">
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded" />
              </div>
              <div>
                <div className="font-semibold">https://www.gitam.edu/</div>
                <div className="text-xs opacity-80">Tr ID 202651541676</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-xs bg-white text-[#1a1f6b] px-2 py-0.5 rounded">
                Payment Link valid For <span className="text-red-500 font-bold">{mm}:{ss}</span>
              </div>
              <button className="text-xs flex items-center gap-1">Details <ChevronDown className="w-3 h-3" /></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[280px_1fr] min-h-[460px]">
          {/* Left: methods */}
          <div className="border-r border-gray-200 p-4 space-y-2 bg-white">
            <div className="text-sm font-semibold text-gray-700 mb-2">Select Payment Method</div>
            {methods.map((m) => {
              const active = method === m.key;
              const Icon = m.icon;
              return (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-md border text-left transition ${
                    active ? "border-indigo-400 bg-indigo-50" : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded bg-gray-100 grid place-items-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{m.label}</span>
                      <span className="flex gap-1">
                        {m.badges.map((b) => (
                          <span key={b} className="text-[8px] px-1 py-0.5 bg-gray-200 rounded">{b}</span>
                        ))}
                      </span>
                    </div>
                    {m.sub && <div className="text-xs text-amber-600 mt-0.5">{m.sub}</div>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: details */}
          <div className="p-5 flex flex-col">
            {/* Offer banner */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-gray-700">Offers</div>
              <button className="text-xs text-indigo-600">View All ›</button>
            </div>
            <div className="border border-amber-300 rounded-md px-3 py-2 flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded bg-blue-100 grid place-items-center text-blue-600 text-xs">%</div>
                <span className="truncate max-w-[280px]">
                  {method === "credit" ? "Savings of up to 1.5% with NeuCard…" : "Upto 5% cashback, max upto…"}
                </span>
              </div>
              <button className="text-indigo-600 text-sm font-medium">Apply</button>
            </div>
            <div className="flex justify-center gap-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            </div>

            {/* Method content */}
            <div className="flex-1">
              {(method === "credit" || method === "debit") && <CardForm />}
              {method === "upi" && <UpiSection />}
              {method === "netbanking" && (
                <NetBankingSection selectedBank={selectedBank} setSelectedBank={setSelectedBank} />
              )}
            </div>

            {/* Pay button */}
            <div className="mt-4 bg-gray-100 rounded-lg p-3 text-center">
              <button
                onClick={() => alert(`Payment of ₹${formatINR(totalPay)} processed (mock)`) }
                className="w-full flex items-center justify-center gap-2 font-semibold text-gray-700"
              >
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Pay ₹ {formatINR(totalPay)}
              </button>
              <div className="text-xs text-gray-500 mt-1">₹ {formatINR(charges)} Platform Charges</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">PCI DSS</span>
            <span>VISA</span>
            <span>MC</span>
            <span>RuPay</span>
            <span>AMEX</span>
          </div>
          <div className="flex flex-col items-end">
            <div>Powered By <span className="font-bold text-indigo-700">≡Easebuzz</span></div>
            <div className="text-[10px]">v 2.6.142</div>
          </div>
        </div>
        <div className="text-center text-[11px] text-gray-500 pb-3">
          By proceeding with payment, you agree with our{" "}
          <a className="text-blue-600 underline" href="#" onClick={(e) => e.preventDefault()}>terms &amp; conditions</a>{" "}
          and{" "}
          <a className="text-blue-600 underline" href="#" onClick={(e) => e.preventDefault()}>privacy policy</a>
        </div>
      </div>
    </div>
  );
};

const CardForm = () => (
  <div>
    <div className="text-sm font-semibold mb-3">Enter Card Details</div>
    <div className="grid grid-cols-2 gap-3">
      <input placeholder="Card Number" className="border rounded px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
      <input placeholder="MM/YY" className="border rounded px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
      <input placeholder="Card Holder Name" className="border rounded px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
      <input placeholder="CVV" className="border rounded px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
    </div>
  </div>
);

const UpiSection = () => (
  <div>
    <div className="text-sm font-semibold mb-3">Pay with UPI QR Code</div>
    <div className="flex items-start gap-4">
      <div className="w-40 h-40 border-2 border-gray-200 rounded grid place-items-center relative bg-white">
        <div
          className="absolute inset-2 opacity-60"
          style={{
            backgroundImage:
              "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)",
            backgroundSize: "12px 12px",
          }}
        />
        <button className="relative z-10 bg-indigo-500 text-white text-xs px-3 py-1.5 rounded">Show QR</button>
      </div>
      <div className="flex-1 pt-2">
        <Smartphone className="w-8 h-8 text-gray-500 mb-2" />
        <div className="text-sm text-gray-700">Scan QR code with any UPI app to proceed with payment.</div>
        <div className="flex gap-2 mt-3 text-[10px]">
          <span className="px-1.5 py-0.5 bg-gray-200 rounded">GPay</span>
          <span className="px-1.5 py-0.5 bg-gray-200 rounded">PTM</span>
          <span className="px-1.5 py-0.5 bg-gray-200 rounded">BHIM</span>
          <span className="px-1.5 py-0.5 bg-gray-200 rounded">CRED</span>
        </div>
      </div>
    </div>
    <div className="mt-5 text-xs text-gray-600">
      <span className="font-semibold">Note :</span> Your daily UPI transaction limit across all UPI Apps is either 1,00,000 or as per your bank's limit.
    </div>
  </div>
);

const NetBankingSection = ({
  selectedBank,
  setSelectedBank,
}: {
  selectedBank: string | null;
  setSelectedBank: (b: string) => void;
}) => {
  const [q, setQ] = useState("");
  const list = banks.filter((b) => b.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="text-sm font-semibold mb-3">Select Bank</div>
      <div className="relative mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by Bank Name"
          className="w-full border rounded px-3 py-2.5 pr-9 text-sm outline-none focus:border-indigo-400"
        />
        <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
      </div>
      <div className="text-xs text-gray-500 mb-2">Popular Banks</div>
      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
        {list.map((b) => (
          <label
            key={b}
            className="flex items-center justify-between border rounded px-3 py-2.5 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gray-100 grid place-items-center text-xs font-bold text-gray-600">
                {b[0]}
              </div>
              <span className="text-sm">{b}</span>
            </div>
            <input
              type="radio"
              name="bank"
              checked={selectedBank === b}
              onChange={() => setSelectedBank(b)}
              className="accent-indigo-500"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default EasebuzzModal;
