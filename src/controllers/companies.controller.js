/**
 * File: src/controllers/companies.controller.js
 * Pengendali untuk rute perusahaan.
 */
import * as companiesService from "../services/companies.service.js";

export const postCompany = async (req, res, next) => {
  try {
    const companyId = await companiesService.createCompany(req.body);
    res
      .status(201)
      .json({ status: "success", data: { id: String(companyId) } });
  } catch (error) {
    next(error);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const companies = await companiesService.getCompanies();
    res.status(200).json({ status: "success", data: { companies } });
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const company = await companiesService.getCompanyById(req.params.id);
    res.status(200).json({ status: "success", data: company });
  } catch (error) {
    next(error);
  }
};

export const putCompany = async (req, res, next) => {
  try {
    await companiesService.updateCompany(req.params.id, req.body);
    res
      .status(200)
      .json({ status: "success", message: "Perusahaan berhasil diperbarui." });
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    await companiesService.deleteCompany(req.params.id);
    res
      .status(200)
      .json({ status: "success", message: "Perusahaan berhasil dihapus." });
  } catch (error) {
    next(error);
  }
};
