export default function AppLogo() {
    return (
        <>
            <div className="flex items-center justify-center">
                <img
                    src="/Sky-Panda-Towers-Logo-1.png"
                    alt="Panda Towers"
                    className="h-10 w-auto object-contain"
                />
            </div>

            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold">
                    Panda Towers
                </span>
            </div>
        </>
    );
}
