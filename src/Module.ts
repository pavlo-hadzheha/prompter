import {
    IAnswers, IBaseModule,
    TModuleConstructor,
    TMaybePromise,
    TNullable
} from "./types";
import inquirer, { QuestionCollection } from "inquirer";
import * as uuid from 'uuid'

export interface Module {
    onInquiryEnd?(): TMaybePromise<unknown>
    nextModuleResolver?(): TMaybePromise<TNullable<TModuleConstructor>>
    onBeforeStart?(): TMaybePromise<void>
}

export abstract class Module implements IBaseModule {
    id = uuid.v4()
    abstract name: string
    abstract parent: TNullable<TModuleConstructor>
    children: TModuleConstructor[] = []
    questions: QuestionCollection = []
    answers: TNullable<IAnswers> = null
    async start(_caller?: TNullable<TModuleConstructor>): Promise<void> {
        this.onBeforeStart ? await this.onBeforeStart() : console.clear()
        return inquirer.prompt(this.questions)
            .then(_answers => {
                this.answers = _answers
                return _answers
            })
            .then(() => this.onInquiryEnd?.())
            .then(() => this.nextModuleResolver?.() || null)
            .then(_nextModuleConstructor => {
                if (_nextModuleConstructor != null) {
                    this.checkChildren(_nextModuleConstructor)
                    return new _nextModuleConstructor()
                }
            }).then(_nextModule => _nextModule?.start())
            .catch(console.error)
    }
    back() {
        if (this.parent) {
            new this.parent().start()
        }
    }
    private checkChildren(_constructor: TModuleConstructor): never | void {
        if (!this.children.some(_child => _child === _constructor)) {
            throw ReferenceError(`${_constructor.name} is not declared as a child of ${this.name}`)
        }
    }
    protected suspend() {
        console.clear()
        process.exit(0)
    }
    static validateUUID(_input: string) {
        return uuid.validate(_input)
    }
}
