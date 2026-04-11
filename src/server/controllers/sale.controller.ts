import { Request, Response } from "express";
import Sale from "../models/sale.model";
import Client from "../models/client.model";

/**
 * Crear venta (F-21)
 */
export const createSale = async (req: Request, res: Response) => {
  try {
    const { clientId, amount, description, saleDate, registeredBy } = req.body;

    // Validar cliente
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const sale = new Sale({
      clientId,
      amount,
      description,
      saleDate,
      registeredBy,
    });

    await sale.save();

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la venta", error });
  }
};

/**
 * Obtener todas las ventas
 */
export const getSales = async (_req: Request, res: Response) => {
  try {
    const sales = await Sale.find()
      .populate("clientId", "name email")
      .populate("registeredBy", "username");

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ventas", error });
  }
};

/**
 * Obtener ventas por cliente (F-22)
 */
export const getSalesByClient = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;

    const sales = await Sale.find({ clientId });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ventas del cliente", error });
  }
};

/**
 * Obtener venta por ID
 */
export const getSaleById = async (req: Request, res: Response) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la venta", error });
  }
};

/**
 * Actualizar venta
 */
export const updateSale = async (req: Request, res: Response) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la venta", error });
  }
};

/**
 * Eliminar venta
 */
export const deleteSale = async (req: Request, res: Response) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json({ message: "Venta eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la venta", error });
  }
};