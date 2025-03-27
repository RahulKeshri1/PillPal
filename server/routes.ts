import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for medication operations
  
  // Get medications for a user
  app.get("/api/medications/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const medications = await storage.getMedicationsByUserId(userId);
      res.json(medications);
    } catch (error) {
      console.error("Error fetching medications:", error);
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });

  // Create a new medication
  app.post("/api/medications", async (req, res) => {
    try {
      const medication = req.body;
      const createdMedication = await storage.createMedication(medication);
      res.status(201).json(createdMedication);
    } catch (error) {
      console.error("Error creating medication:", error);
      res.status(500).json({ message: "Failed to create medication" });
    }
  });

  // Update a medication
  app.put("/api/medications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const medication = req.body;
      const updatedMedication = await storage.updateMedication(parseInt(id), medication);
      res.json(updatedMedication);
    } catch (error) {
      console.error("Error updating medication:", error);
      res.status(500).json({ message: "Failed to update medication" });
    }
  });

  // Delete a medication
  app.delete("/api/medications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMedication(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting medication:", error);
      res.status(500).json({ message: "Failed to delete medication" });
    }
  });

  // Get medication logs for a user
  app.get("/api/medication-logs/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const logs = await storage.getMedicationLogsByUserId(userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching medication logs:", error);
      res.status(500).json({ message: "Failed to fetch medication logs" });
    }
  });

  // Create a new medication log entry
  app.post("/api/medication-logs", async (req, res) => {
    try {
      const log = req.body;
      const createdLog = await storage.createMedicationLog(log);
      res.status(201).json(createdLog);
    } catch (error) {
      console.error("Error creating medication log:", error);
      res.status(500).json({ message: "Failed to create medication log" });
    }
  });

  // Get user profiles
  app.get("/api/profiles/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profiles = await storage.getProfilesByUserId(userId);
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  // Create a new profile
  app.post("/api/profiles", async (req, res) => {
    try {
      const profile = req.body;
      const createdProfile = await storage.createProfile(profile);
      res.status(201).json(createdProfile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Update a profile
  app.put("/api/profiles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const profile = req.body;
      const updatedProfile = await storage.updateProfile(parseInt(id), profile);
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Delete a profile
  app.delete("/api/profiles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProfile(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting profile:", error);
      res.status(500).json({ message: "Failed to delete profile" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
