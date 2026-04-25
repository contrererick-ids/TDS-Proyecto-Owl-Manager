import { Request, Response } from "express";
import Sale from "../models/sale.model";
import Client from "../models/client.model";

/**
 * Crear venta (F-21)
 */
export const createSale = async (req: Request, res: Response) => {
  try {
    const { clientId, amount, description, saleDate } = req.body;

    // Validar clientId obligatorio
    if (!clientId) {
      return res.status(400).json({
        message: "clientId es requerido"
      });
    }

    // Validar cliente
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Validar monto obligatorio
    if (amount === undefined) {
      return res.status(400).json({
        message: 'Amount es requerido'
      });
    }

    // Validar monto válido
    if (amount <= 0) {
      return res.status(400).json({
        message: 'Amount debe ser mayor que 0'
      });
    }

    const sale = new Sale({
      clientId,
      amount,
      description,
      saleDate,
      registeredBy: (req as any).user?.id
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
    const sales = await Sale.find({ isActive: true })
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

    const sales = await Sale.find({ clientId, isActive: true });

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
    const { id } = req.params;

    const sale = await Sale.findById(id)
      .populate("clientId", "name email")
      .populate("registeredBy", "username");

    if (!sale) {
      return res.status(404).json({
        message: "Venta no encontrada"
      });
    }

    res.json(sale);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la venta",
      error
    });
  }
};

/**
 * Actualizar venta
 */
export const updateSale = async (req: Request, res: Response) => {
  try {
    const { amount, clientId } = req.body;

    // validar clientId si viene
    if (clientId !== undefined) {
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({
          message: "Cliente no encontrado"
        });
      }
    }

    // validar monto si viene
    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({
        message: "Amount debe ser mayor que 0"
      });
    }

    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

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
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!sale) {
      return res.status(404).json({
        message: "Venta no encontrada"
      });
    }

    res.json({
      message: "Venta desactivada correctamente",
      sale
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la venta",
      error
    });
  }
};
