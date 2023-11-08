import { Answers, QuestionCollection } from "inquirer";

export type IAnswers = Answers

export enum ECommonAction {
    BACK = +(Math.random() * 1_000_000).toFixed(0),
    CLOSE = +(Math.random() * 1_000_000).toFixed(0)
}

export type TNullable<T> = T | null
export type TMaybePromise<T> = Promise<T> | T


export interface IModuleOnInquiryEnd {
    onInquiryEnd(): TMaybePromise<unknown>
}

export interface INextModuleResolver {
    nextModuleResolver(): TMaybePromise<TNullable<TModuleConstructor>>
}
export interface IOnBeforeStart {
    onBeforeStart(): TMaybePromise<void>
}

export interface IBaseModule {
    id: string
    children: TModuleConstructor[]
    parent: TNullable<TModuleConstructor>
    questions: QuestionCollection
    answers: TNullable<IAnswers>
    start(): TMaybePromise<void>
}

export type TConstructor<T = {}> = new (...args: any[]) => T

export type TModuleConstructor = TConstructor<IBaseModule>

