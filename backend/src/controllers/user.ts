import { NextFunction, Response, Request } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";

export const newUser = async (
  req: Request<{},{}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {} = req.body;

    const user = await User.create({});

    return res.status(200).json({
      success: true,
      message: `Welcome ${user.name}`,
    });
  } catch (error) {}
};
