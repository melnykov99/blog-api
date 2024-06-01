import {Request} from "express";

type RequestWithBody<T> = Request<{}, {}, T>
type RequestWithQuery<T> = Request<{}, {}, {}, T>
type RequestWithParams<T> = Request<T>
type RequestWithParamsAndBody<Tparams, Tbody> = Request<Tparams, {}, Tbody>
type RequestWithParamsAndQuery<Tparams, Tquery> = Request<Tparams, {}, {}, Tquery>

export {RequestWithBody, RequestWithQuery, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery}