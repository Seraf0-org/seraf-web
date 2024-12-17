import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

test("ヘッダーにナビゲーションリンクが表示される", () => {
    render(<Header />);
    expect(screen.getByText("ホーム")).toBeInTheDocument();
    expect(screen.getByText("アバウト")).toBeInTheDocument();
});
