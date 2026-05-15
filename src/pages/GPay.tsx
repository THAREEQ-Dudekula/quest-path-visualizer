import { useMemo, useState, useEffect } from "react";
import { User, History, CreditCard, Building2, BookOpen, Briefcase, LogIn, Timer } from "lucide-react";
import { toast } from "sonner";

type TabKey = "profile" | "history" | "tuition" | "hostel" | "library" | "training";

const sidebarItems: { key: TabKey; label: string; icon: typeof User }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "history", label: "Payment history", icon: History },
  { key: "tuition", label: "Tuition fee", icon: CreditCard },
  { key: "hostel", label: "Hostel fee", icon: Building2 },
  { key: "library", label: "Library. fee", icon: BookOpen },
  { key: "training", label: "Training and", icon: Briefcase },
];

const feeRows = [
  { id: "late", label: "Late Fee", amount: 9000 },
  { id: "even", label: "Even Semester", amount: 137930 },
];

const GPay = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("tuition");
  const [checked, setChecked] = useState<Record<string, boolean>>({ late: false, even: false });
  const [method, setMethod] = useState<"online" | "dd">("online");
  const [accepted, setAccepted] = useState(false);
  const [now, setNow] = useState(new Date());
  const [seconds, setSeconds] = useState(15 * 60 + 15);

  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date());
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const total = useMemo(
    () => feeRows.reduce((sum, r) => sum + (checked[r.id] ? r.amount : 0), 0),
    [checked]
  );

  const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.toLocaleTimeString(
    "en-US",
    { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }
  )}`;

  const sessionStr = `${String(Math.floor(seconds / 60)).padStart(2, "0")}m : ${String(
    seconds % 60
  ).padStart(2, "0")}s`;

  const handlePay = () => {
    if (total === 0) return toast.error("Select at least one fee to pay.");
    if (!accepted) return toast.error("Please accept the terms & conditions.");
    toast.success(`Redirecting to ${method === "online" ? "online payment" : "DD"} for ₹${total.toLocaleString("en-IN")}…`);
  };

  return (
    <div className="min-h-screen bg-[#f3f7f5] text-[#0b3b2e] font-sans">
      {/* Header */}
      <header className="bg-[#0a6b52] text-white shadow">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-md px-3 py-1.5 leading-tight">
              <div className="text-[#0a6b52] font-extrabold text-2xl tracking-tight">G-Pay</div>
              <div className="text-[#0a6b52] text-[10px] -mt-1">Unified payment portal</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="opacity-90">Welcome, </span>
              <span className="font-semibold">DUDEKULA THAREEQ (2023008156)</span>
              <span className="ml-6 opacity-90">Date : </span>
              <span className="font-semibold">{dateStr}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <span>Session</span>
              <Timer className="w-4 h-4" />
              <span>:</span>
              <span className="font-semibold">{sessionStr}</span>
            </div>
            <button
              onClick={() => toast("Logged out (mock)")}
              className="flex items-center gap-2 bg-white text-[#0a6b52] rounded-full pl-2 pr-4 py-1.5 font-semibold hover:bg-gray-100"
            >
              <span className="w-7 h-7 rounded-full bg-[#0a6b52] text-white grid place-items-center">
                <LogIn className="w-4 h-4" />
              </span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 p-4 space-y-3 border-r border-gray-200 bg-[#f3f7f5] min-h-[calc(100vh-64px)]">
          {sidebarItems.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex flex-col items-center justify-center gap-2 py-5 rounded-md border transition ${
                  active
                    ? "bg-[#d6efe5] border-[#0a6b52] text-[#0a6b52] font-semibold"
                    : "bg-white border-gray-200 text-[#0b3b2e] hover:border-[#0a6b52]"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm">{label}</span>
              </button>
            );
          })}
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <div className="bg-white rounded-md shadow-sm p-8 min-h-[600px]">
            {activeTab === "tuition" && (
              <>
                <h1 className="text-xl font-semibold mb-6">Tuition fee</h1>
                <div className="border-t border-gray-200 pt-6">
                  <table className="w-[480px]">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2 font-semibold">Category</th>
                        <th className="px-4 py-2 font-semibold">Fee (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeRows.map((r) => (
                        <tr key={r.id} className="border-b border-gray-100">
                          <td className="px-4 py-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!checked[r.id]}
                                onChange={(e) =>
                                  setChecked((c) => ({ ...c, [r.id]: e.target.checked }))
                                }
                                className="w-4 h-4 accent-[#0a6b52]"
                              />
                              {r.label}
                            </label>
                          </td>
                          <td className="px-4 py-3">{r.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-6 space-y-2 text-sm font-bold">
                    <div className="flex gap-8">
                      <span className="w-32">Sub total</span>
                      <span>:</span>
                      <span>{total}</span>
                    </div>
                    <div className="flex gap-8">
                      <span className="w-32">Total to be paid</span>
                      <span>:</span>
                      <span>{total}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 mt-8 pt-6 flex items-center gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="method"
                        checked={method === "online"}
                        onChange={() => setMethod("online")}
                        className="w-4 h-4 accent-[#0a6b52]"
                      />
                      Online
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="method"
                        checked={method === "dd"}
                        onChange={() => setMethod("dd")}
                        className="w-4 h-4 accent-[#0a6b52]"
                      />
                      Demand Draft (DD)
                    </label>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="w-4 h-4 accent-[#0a6b52]"
                    />
                    I accept{" "}
                    <a className="text-blue-600 underline" href="#" onClick={(e) => e.preventDefault()}>
                      terms &amp; conditions.
                    </a>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={handlePay}
                      className="bg-[#0a6b52] text-white px-8 py-2.5 rounded font-semibold hover:bg-[#085a45]"
                    >
                      Proceed to pay
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "profile" && (
              <MockSection title="Profile">
                <ProfileRow label="Name" value="DUDEKULA THAREEQ" />
                <ProfileRow label="Registration No." value="2023008156" />
                <ProfileRow label="Program" value="B.Tech CSE" />
                <ProfileRow label="Campus" value="GITAM Visakhapatnam" />
                <ProfileRow label="Email" value="dthareeq@gitam.in" />
              </MockSection>
            )}

            {activeTab === "history" && (
              <MockSection title="Payment history">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Amount (₹)</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["12/08/2025", "Odd Semester Fee", "1,34,930", "Paid"],
                      ["05/01/2025", "Hostel Fee", "85,000", "Paid"],
                      ["20/07/2024", "Even Semester Fee", "1,28,500", "Paid"],
                    ].map((r, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        {r.map((c, j) => (
                          <td key={j} className="px-4 py-3">{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </MockSection>
            )}

            {activeTab === "hostel" && <MockSection title="Hostel fee"><p className="text-sm">No outstanding hostel dues.</p></MockSection>}
            {activeTab === "library" && <MockSection title="Library fee"><p className="text-sm">No outstanding library dues.</p></MockSection>}
            {activeTab === "training" && <MockSection title="Training and Placement fee"><p className="text-sm">No outstanding training dues.</p></MockSection>}
          </div>
        </main>
      </div>
    </div>
  );
};

const MockSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <>
    <h1 className="text-xl font-semibold mb-6">{title}</h1>
    <div className="border-t border-gray-200 pt-6 space-y-3">{children}</div>
  </>
);

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex text-sm">
    <span className="w-48 text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default GPay;
