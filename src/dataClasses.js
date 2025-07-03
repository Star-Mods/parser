
// Example usage:
// console.log(Bit.validate("1"));        // true
// console.log(Bit.toNumber("0"));        // 0
// console.log(Real32.validate(1.5));     // true
// console.log(Int8.validate(127));       // true
// console.log(Int8.validate("128"));     // false
// console.log(UInt64.validate("18446744073709551615")); // true
// console.log(Int64.validate(-9223372036854775808n));   // true


// ====== Dynamic Class Factories ======

function createIntClass(name, min, max, allowBigInt = false) {
  return {
    [name]: class {
      static validate(val) {
        if (typeof val === 'string') {
          if (allowBigInt) {
            try {
              val = BigInt(val);
            } catch {
              return false;
            }
          } else {
            val = Number(val);
            if (Number.isNaN(val)) return false;
          }
        }
        if (allowBigInt) {
          if (typeof val !== 'bigint') return false;
          return val >= min && val <= max;
        } else {
          if (typeof val !== 'number' || !Number.isInteger(val)) return false;
          return val >= min && val <= max;
        }
      }
    }
  }[name];
}

function createFloatClass(name, minNormal, max, minSubnormal = 0) {
  return {
    [name]: class {
      static validate(val) {
        if (typeof val === 'string') {
          val = Number(val);
          if (Number.isNaN(val)) return false;
        }
        if (typeof val !== 'number' || !isFinite(val)) return false;
        if (val === 0) return true;
        const absVal = Math.abs(val);
        if (absVal >= minNormal && absVal <= max) return true;
        if (absVal > 0 && absVal < minNormal && absVal >= minSubnormal) return true;
        return false;
      }
    }
  }[name];
}

function createListClass(name, regex) {
  return {
    [name]: class {
      static validate(str) {
        if (typeof str !== 'string') return false;
        const parts = str.split(',').map(s => s.trim());
        if (parts.length === 0) return false;
        return parts.every(p => regex.test(p));
      }
    }
  }[name];
}

// ====== Integer Classes ======

const Bit    = createIntClass('Bit', 0, 1);
const Int8   = createIntClass('Int8', -128, 127);
const UInt8  = createIntClass('UInt8', 0, 255);
const Int16  = createIntClass('Int16', -32768, 32767);
const UInt16 = createIntClass('UInt16', 0, 65535);
const Int32  = createIntClass('Int32', -2147483648, 2147483647);
const UInt32 = createIntClass('UInt32', 0, 4294967295);
const UInt64 = createIntClass('UInt64', 0n, (2n ** 64n) - 1n, true);
const Int    = createIntClass('Int', -(2n ** 63n), (2n ** 63n) - 1n, true);

// ====== Float Classes ======

const Real32 = createFloatClass('Real32', 1.17549435e-38, 3.4028235e+38, 1.4e-45);
const Real   = createFloatClass('Real', 2.2250738585072014e-308, 1.7976931348623157e+308, 5e-324);

// ====== List Validators ======

const RealList = createListClass('RealList', /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/);
const IntList  = createListClass('IntList', /^[+-]?\d+$/);
const WordList = createListClass('WordList', /^\S+$/);

// ====== Word Class ======

class Word {
  static validate(str) {
    return typeof str === 'string' && /^\S+$/.test(str);
  }
}

// ====== Exports ======


class Word {
  static validate(str) {
    return typeof str === 'string' && /^\S+$/.test(str);
  }
}
class Text {
  static validate(val) {
    return typeof val === 'string';
  }
}
class CString {
  static validate(val) {
    return typeof val === 'string';
  }
}
class Unknown {
  static validate(val) {
    return typeof val === 'string';
  }
}
class CFile {
  static filenameRegex = /^[^<>:"/\\|?*\s]+$/; // Basic Windows-safe filename without path
  static validate(val) {
    return typeof val === 'string' && this.filenameRegex.test(val);
  }
}
class Link {
  static validate(val) {
    return typeof val === 'string' && /^[^\s]+$/.test(val);
  }
}


// For arrays:
class CArray {
  constructor(subType) {
    this.subType = subType;
  }
  
  parse(xmlElement) {
    if (!xmlElement) return [];
    // If xmlElement is a parent element containing multiple children of subType name
    const children = Array.from(xmlElement.children);
    return children.map(child => this.subType.parse(child));
  }
}


function createEnumClass(name, values) {
  return {
    [name]: class {
      static values = values;
      static validate(val) {
        return this.values.includes(val);
      }
      static get name() {
        return name;
      }
    }
  }[name];
}


export {
  createEnumClass,
  Bit, Int8, UInt8, Int16, UInt16, Int32, UInt32, UInt64, Int,
  Real32, Real,
  RealList, IntList, WordList,
  Word, Text, CString, Unknown,
  CFile,
  Link,
  CArray
};

