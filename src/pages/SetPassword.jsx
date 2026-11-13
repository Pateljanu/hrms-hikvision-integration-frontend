
// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setPasswordWithToken } from "../features/employees/employeesThunks";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";

// export default function SetPassword() {
//   const dispatch = useDispatch();
//   const [token, setToken] = useState("");

//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [strength, setStrength] = useState(0);

//   useEffect(() => {
//     const urlToken = new URLSearchParams(window.location.search).get("token");
//     setToken(urlToken);
//   }, []);

//   // ⭐ Calculate password strength
//   const calculateStrength = (pwd) => {
//     let score = 0;
//     if (pwd.length >= 6) score += 25;
//     if (/[A-Z]/.test(pwd)) score += 25;
//     if (/[0-9]/.test(pwd)) score += 25;
//     if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
//     return score;
//   };

//   const handlePassword = (value) => {
//     setPassword(value);
//     setStrength(calculateStrength(value));
//   };

//   const handleSubmit = async () => {
//     if (!password || !confirm) {
//       toast.error("Fill all fields");
//       return;
//     }

//     if (password !== confirm) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     if (strength < 50) {
//       toast.error("Password is too weak");
//       return;
//     }

//     const res = await dispatch(
//       setPasswordWithToken({ token, newPassword: password })
//     );

//     if (res.meta.requestStatus === "fulfilled") {
//       toast.success("Password set successfully!");
//     } else {
//       toast.error(res.payload || "Invalid or expired link");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
//       <Card className="w-full max-w-md shadow-lg border">
//         <CardHeader>
//           <CardTitle className="text-center">Set New Password</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {/* Password Input */}
//           <div>
//             <label className="text-sm font-medium">New Password</label>
//             <Input
//               type="password"
//               value={password}
//               onChange={(e) => handlePassword(e.target.value)}
//               placeholder="Enter new password"
//             />
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="text-sm font-medium">Re-enter Password</label>
//             <Input
//               type="password"
//               value={confirm}
//               onChange={(e) => setConfirm(e.target.value)}
//               placeholder="Re-enter new password"
//             />
//           </div>

//           {/* Strength Meter */}
//           <div className="space-y-1">
//             <p className="text-sm font-medium">Password Strength</p>
//             <Progress value={strength} className="h-2" />
//             <p
//               className={`text-xs ${
//                 strength < 50
//                   ? "text-red-500"
//                   : strength < 75
//                   ? "text-yellow-500"
//                   : "text-green-600"
//               }`}
//             >
//               {strength < 50
//                 ? "Weak"
//                 : strength < 75
//                 ? "Medium"
//                 : "Strong"}
//             </p>
//           </div>

//           <Button className="w-full mt-4" onClick={handleSubmit}>
//             Update Password
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPasswordWithToken } from "../features/employees/employeesThunks";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function SetPassword() {
  const dispatch = useDispatch();
  const [token, setToken] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [strength, setStrength] = useState(0);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken);
  }, []);

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const handlePassword = (value) => {
    setPassword(value);
    setStrength(calculateStrength(value));
  };

  const handleSubmit = async () => {
    if (!password || !confirm) return toast.error("Fill all fields");
    if (password !== confirm) return toast.error("Passwords do not match");
    if (strength < 50) return toast.error("Password is too weak");

    const res = await dispatch(
      setPasswordWithToken({ token, newPassword: password })
    );

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Password set successfully!");
    } else {
      toast.error(res.payload || "Invalid or expired link");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center">Set New Password</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          
          {/* Password Input */}
          <div className="relative">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => handlePassword(e.target.value)}
              placeholder="Enter new password"
              className="pr-10"
            />

            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-8 text-gray-500 hover:text-black"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-sm font-medium">Re-enter Password</label>
            <Input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              className="pr-10"
            />

            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-8 text-gray-500 hover:text-black"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Strength Meter */}
          <div className="space-y-1">
            <p className="text-sm font-medium">Password Strength</p>
            <Progress value={strength} className="h-2" />
            <p
              className={`text-xs ${
                strength < 50
                  ? "text-red-500"
                  : strength < 75
                  ? "text-yellow-500"
                  : "text-green-600"
              }`}
            >
              {strength < 50 ? "Weak" : strength < 75 ? "Medium" : "Strong"}
            </p>
          </div>

          <Button className="w-full mt-4" onClick={handleSubmit}>
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
