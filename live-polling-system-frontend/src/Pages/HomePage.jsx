import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const roleOptions = [
	{
		id: "student",
		title: "I'm a Student",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
	},
	{
		id: "teacher",
		title: "I'm a Teacher",
		description: "Submit answers and view live poll results in real-time.",
	},
];

export const HomePage = () => {
	const [selectedRole, setSelectedRole] = useState("student");
	const navigate = useNavigate();

	const handleContinue = () => {
		if (selectedRole === "teacher") {
			navigate("/teacher");
		} else {
			navigate("/student");
		}
	};

	return (
		<div className="bg-white w-screen min-h-screen relative overflow-x-auto">
			{/* Intervue Poll Badge */}
			<div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
				<div className="flex w-[134px] h-[31px] items-center justify-center gap-[7px] px-[9px] py-0 rounded-3xl bg-[linear-gradient(90deg,rgba(117,101,217,1)_0%,rgba(77,10,205,1)_100%)]">
					<>
						<img
							className="relative w-[14.66px] h-[14.65px]"
							alt="Vector"
							src="/vector.svg"
						/>
						<span className="relative flex items-center justify-center w-fit font-['Sora'] font-semibold text-white text-sm">
							Intervue Poll
						</span>
					</>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-col items-center gap-16 pt-20 pb-20 px-4 w-full h-full">
				{/* Header Section */}
				<div className="flex flex-col items-center gap-[26px]">
					<div className="flex flex-col max-w-3xl items-center gap-[5px]">
						<h1 className="text-center font-['Sora'] font-normal text-black text-[40px] leading-normal">
							<span className="font-normal">Welcome to the </span>
							<span className="font-semibold">Live Polling System</span>
						</h1>
						<p className="text-center font-['Sora'] font-normal text-[#00000080] text-[19px] leading-normal px-4">
							Please select the role that best describes you to begin using the
							live polling system
						</p>
					</div>
				</div>

				{/* Role Selection Cards */}
				<div className="flex gap-8 w-full justify-center">
					{roleOptions.map((role) => (
						<div
							key={role.id}
							className={`relative flex flex-col w-[387px] h-[143px] items-start justify-center gap-[17px] pl-[25px] pr-[17px] py-[15px] rounded-[10px] cursor-pointer transition-all ${
								selectedRole === role.id
									? "border-[3px] border-transparent bg-gradient-to-br from-[#7765da] to-[#1d68bd] p-[3px]"
									: "border border-[#d9d9d9] hover:border-[#7765da] hover:shadow-lg"
							}`}
							onClick={() => setSelectedRole(role.id)}
						>
							{selectedRole === role.id && (
								<div className="absolute inset-[3px] bg-white rounded-[7px] flex flex-col items-start justify-center gap-[17px] pl-[25px] pr-[17px] py-[15px]">
									<h3 className="font-['Sora'] font-semibold text-black text-[23px] leading-normal">
										{role.title}
									</h3>
									<p className="font-['Sora'] font-normal text-[#454545] text-base leading-normal">
										{role.description}
									</p>
								</div>
							)}
							{selectedRole !== role.id && (
								<>
									<h3 className="font-['Sora'] font-semibold text-black text-[23px] leading-normal">
										{role.title}
									</h3>
									<p className="font-['Sora'] font-normal text-[#454545] text-base leading-normal">
										{role.description}
									</p>
								</>
							)}
						</div>
					))}
				</div>

				{/* Continue Button */}
				<button
					onClick={handleContinue}
					className="w-[234px] h-[58px] flex items-center justify-center gap-2.5 px-[70px] py-[17px] rounded-[34px] bg-[linear-gradient(159deg,rgba(143,100,225,1)_0%,rgba(29,104,189,1)_100%)] hover:bg-[linear-gradient(159deg,rgba(143,100,225,0.9)_0%,rgba(29,104,189,0.9)_100%)] border-none transition-all duration-200 cursor-pointer"
				>
					<span className="font-['Sora'] font-semibold text-white text-lg leading-normal">
						Continue
					</span>
				</button>
			</div>
		</div>
	);
};