import { render, fireEvent } from "@testing-library/vue";
import HelloWorld from "./HelloWorld.vue";
import { describe, it, expect } from "vitest";

describe("HelloWorld.vue", () => {
  it("renders the message and increments the counter", async () => {
    const { getByText } = render(HelloWorld, {
      props: { msg: "Hello Vitest!" },
    });

    // Check if the message is rendered
    getByText("Hello Vitest!");

    // Check if the button increments the counter
    const button = getByText("count is 0");
    expect(button.textContent).toBe("count is 0"); // Verify initial button text
    await fireEvent.click(button);
    expect(button.textContent).toBe("count is 1"); // Verify updated button text
  });
});
