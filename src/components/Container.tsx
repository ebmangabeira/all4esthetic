import React from "react";

type Props = {
	children: React.ReactNode;
	fluid?: boolean;
	xl?: boolean;
	className?: string;
};

export default function Container({ children, fluid, xl, className }: Props) {
	let base = fluid ? "container-fluid" : "container";
	if (xl) base += " container-xl";
	const cls = className ? `${base} ${className}` : base;
	return <div className={cls}>{children}</div>;
}
