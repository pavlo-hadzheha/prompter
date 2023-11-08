import chalk from "chalk";
import { makePropertyMapper } from "./make-property-mapper";
import { ECommonAction } from "../types";

export function CanGoBack(_questionName: string) {
  return function (_target: any, _key: string) {
    makePropertyMapper(_target, _key, _questions => {
      if (_questions && _questions instanceof Array) {
        const withChoices = _questions.find(_q => _q.type === 'list' &&
          (_questionName
            ? _q.name === _questionName
            : !!_q.choices?.length)
        )
        if (withChoices) {
          withChoices.choices = [
            { name: chalk.yellowBright('Back'), value: ECommonAction.BACK },
            ...(withChoices.choices || [])
          ]
        }
      }
      return _questions
    })
  }
}
