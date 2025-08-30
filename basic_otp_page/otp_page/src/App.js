import { useEffect, useRef, useState } from "react";
import './styles/basicOtp.css'
function App() {
  let arrayLength = 6;
  let array = Array.from({ length: arrayLength }).fill('');
  let [otp, setOtp] = useState(array);
  let inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0].focus();
  }, [])

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      let copyOtp = [...otp];
      copyOtp[index] = value;
      setOtp(copyOtp);
      if (index < arrayLength - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && !otp[index]) {
      let copyOtp = [...otp];
      copyOtp[index - 1] = '';
      setOtp(copyOtp);
      inputsRef.current[index - 1].focus();
    } else if (otp[index]) {
      let copyOtp = [...otp];
      copyOtp[index] = '';
      setOtp(copyOtp);
      inputsRef.current[index].focus();
    }
  };

  return <div className="main-container">
    <div className="container">
      <h3>Enter 6 digit OTP</h3>
      <div className="boxes-container">

        {otp.map((num, index) => {
          return <input
            key={index}
            type="text"
            className="box"
            onKeyDown={(ev) => handleKeyDown(ev, index)}
            value={otp[index]} // same as value={num}
            ref={(el) => inputsRef.current[index] = el}
            onChange={(ev) => handleChange(ev, index)}
            maxLength={1}
          />
        })}
      </div>
      <button>Verify</button>
    </div>

  </div>
}
export default App;

/*
Notes:
Why onChange needed?
using onKeyDown for value updates does not work as expected for controlled inputs 
in React—the value in the input field doesn't get updated when the key is pressed, 
because onKeyDown triggers before the input value changes,
so ev.target.value always gets the previous value instead of the newly entered digit.

In React, when you want changes to appear in an <input>'s value,
you typically use onChange to capture the entered value and then update state.

With onKeyDown, ev.target.value doesn't reflect the key pressed to change the value; 
it only has the value before the key is processed.

Use onChange instead of onKeyDown for updating the value, 
and use onKeyDown only for navigation control (like moving back or forward on Backspace or arrow keys).

The input should be restricted to only allow one character, and the code should move focus as needed.

*/
/*
Issue : when a number is entered in one field, it appears in the next field instead of the intended one. 

  const handleChange = (ev, index) => {
    let { value } = ev.target;
    if (/^[0-9]?$/.test(value)) {
      const copyOtp = [...otp];
      copyOtp[index] = value
      setOtp(copyOtp)
      console.log(copyOtp)

    } else if (ev.key === 'Backspace' && index) {
      const copyOtp = [...otp];
      copyOtp[index - 1] = '';
      setOtp(copyOtp)
      console.log(copyOtp)
    }
  }
  const handleKeyDown = (ev, index) => {
    let { value } = ev.target;
    if (/^[0-9]?$/.test(value)) {

      if (index < otp.length - 1) {
        inputsRef.current[index + 1].focus();
      }

    } else if (ev.key === 'Backspace' && index) {
      inputsRef.current[index - 1].focus();
    }
  }

Root cause: onKeyDown is executing first and next box is getting focus,
later onChange is executing so, it is assigning value to next field

Yes, the behavior described is expected and here’s why:

When a key is pressed, the onKeyDown event fires first.
Because the focus is moved on onKeyDown, the next input box becomes the focused element before the input value actually updates.

Then, when React processes the onChange event (which fires after the input’s value actually changes), 
it triggers on the input box that is currently focused — which is now the next box due to the earlier focus shift.

Therefore, the value entered during that keypress appears in the next box, 
because by the time onChange fires, focus has moved there.

In contrast, the onKeyDown event is still tied to the initial input box (before focus shift).

This means:
The user typed a character in the first input.
onKeyDown fires in the first input, and your code moves focus to the second input.
onChange fires, but now the second input is focused, so the event is for the second input.
React updates state with the new value for the second input, so the character appears in the second box.
Thus, the onChange event corresponds to whichever input is focused when the input's value changes, 
not necessarily the input where the key was originally pressed.
*/

/*
Key points: move focus only after state update
onKeyDown will execute before onChange
onKeyDown will have value as undefined
onChange for value update and move focus to next box
onKeyDown for backspace
*/