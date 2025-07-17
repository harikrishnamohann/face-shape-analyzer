import { useRef, type JSX } from "react";

const enum InputErrMsg {
  NoErr = "none",
  RangeInvalid = "value is not a real facial length.",
  NonNumerical = "Non-numerical input is restricted.",
  EmptyFields = "All values should be given.",
}

function focusNextInputElement(event: React.KeyboardEvent<HTMLInputElement>): void {
  const target = event.target as HTMLInputElement;
  if (!target.classList.contains("err") && target.value !== "" && event.key === "Enter") {
    const inputs = Array.from(
      target.closest("ul")?.querySelectorAll("input") ?? []
    ) as HTMLInputElement[];
    const idx = inputs.indexOf(target);
    if (idx !== -1 && idx < inputs.length - 1) {
      inputs[idx + 1].focus();
    }
  }
}

interface QueryInputProps {
  item: string;
  setItem: (item: string) => void;
  setInputErr: (statusMsg: InputErrMsg) => void;
}
function QueryInput(props: QueryInputProps): JSX.Element {
  function handleInput(event: React.FormEvent<HTMLInputElement>): void {
    const target = event.target as HTMLInputElement;
    if (target.value === "") {
      props.setInputErr(InputErrMsg.NonNumerical);
      target.value = "";
      target.classList.remove("err");
    } else if (target.validity.rangeOverflow || target.validity.rangeUnderflow) {
      props.setInputErr(InputErrMsg.RangeInvalid);
      target.classList.add("err");
    } else {
      props.setInputErr(InputErrMsg.NoErr);
      target.classList.remove("err");
    }
  }

  const inputRef = useRef<null | HTMLInputElement>(null);
  return (
    <div className="queryInputField" onMouseUp={() => inputRef.current?.focus()}>
      <label>{props.item}</label>
      <input
        type="number"
        min={5}
        max={40}
        id={props.item}
        placeholder="in cm"
        ref={inputRef}
        onInput={(event) => setTimeout(() => handleInput(event), 600)}
        onKeyUp={(event) => focusNextInputElement(event)}
        onFocus={() => props.setItem(props.item.toLowerCase())}
      />
    </div>
  );
}

interface QueryFormProps {
  queryItems: string[];
  setQueryItem: (item: string) => void;
  inputErr: InputErrMsg;
  setInputErr: (InputErr: InputErrMsg) => void;
}

function QueryForm(props: QueryFormProps): JSX.Element {
  return (
    <div className="queryBox stylize">
      <u>
        <h3>My face</h3>
      </u>
      <ul>
        {props.queryItems.map((item) => (
          <QueryInput
            key={item.toLowerCase()}
            item={item}
            setItem={props.setQueryItem}
            setInputErr={props.setInputErr}
          />
        ))}
      </ul>
      <p className="errMsg">{props.inputErr !== InputErrMsg.NoErr && props.inputErr}</p>
    </div>
  );
}

export { QueryForm, InputErrMsg };
