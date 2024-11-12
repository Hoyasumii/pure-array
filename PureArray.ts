import { z, ZodSchema } from "zod";
import { InvalidIndexError, InvalidValueError } from "@/exceptions";

function PureArray(length: number, type?: ZodSchema) {
  const data: Record<number, undefined | unknown> = {};

  for (let index = 0; index < length; index++) {
    data[index] = undefined;
  }

  return new Proxy(data, {
    get(target, prop) {
      let indexProp: number = parseInt(prop.toString());

      if (indexProp !== 0 && isNaN(indexProp))
        throw new InvalidIndexError(indexProp.toString());

      if (indexProp < 0 && indexProp >= -length) {
        indexProp = length + indexProp;
      }

      if (indexProp in target) {
        return target[indexProp];
      }

      throw new InvalidIndexError(indexProp.toString());
    },
    set(target, prop, newValue) {
      if (prop in target) {
        const indexProp: number = parseInt(prop.toString());

        if (type) {
          const valueParse = type?.safeParse(newValue) || null;

          if (valueParse?.success === false) {
            const issues: Record<string, string> = {};

            for (let issue of valueParse.error.issues) {
              issues[issue.path.join(", ")] = issue.message;
            }

            throw new InvalidValueError(JSON.stringify(issues));
          }
        }

        target[indexProp] = newValue;
        return true;
      }

      throw new InvalidIndexError(prop.toString());
    },
  });
}
