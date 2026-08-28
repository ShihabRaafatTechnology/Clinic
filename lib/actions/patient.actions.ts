"use server";

import { ID, Query } from "node-appwrite"
import { databases, users, storage, BUCKET_ID, DATABASE_ID, PATIENT_TABLE_ID } from "../appwrite.config"

export const createUser = async (userData: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            userData.email,
            userData.phone,
            undefined,
            userData.name,
        )
        return { $id: newUser.$id }
    }
    catch (error: any) {
        if (error && error?.code === 409) {
            const documents = await users.list([
                Query.equal("email", [userData.email])
            ])
            return { $id: documents.users[0].$id }
        }
    }
}

export const registerPatient = async (patientData: RegisterUserParams) => {
    try {
        let identificationDocumentUrl: string | undefined;

        if (patientData.identificationDocument && BUCKET_ID) {
            const blobFile = patientData.identificationDocument.get("blobFile") as Blob;
            const fileName = patientData.identificationDocument.get("fileName") as string;
            const arrayBuffer = await blobFile.arrayBuffer();
            const file = new File([arrayBuffer], fileName, { type: blobFile.type });
            const uploaded = await storage.createFile(
                BUCKET_ID,
                ID.unique(),
                file
            );
            identificationDocumentUrl = storage.getFileView(BUCKET_ID, uploaded.$id).toString();
        }

        const patientDocument = {
            userId: patientData.userId,
            name: patientData.name,
            email: patientData.email,
            phone: patientData.phone,
            birthDate: patientData.birthDate,
            gender: patientData.gender.toLowerCase(),
            address: patientData.address,
            occupation: patientData.occupation,
            emergencyContactName: patientData.emergencyContactName,
            emergencyContactNumber: patientData.emergencyContactNumber,
            primaryPhysician: patientData.primaryPhysician,
            insuranceProvider: patientData.insuranceProvider,
            insurancePolicyNumber: patientData.insurancePolicyNumber,
            allergies: patientData.allergies ?? "",
            currentMedication: patientData.currentMedication ?? "",
            familyMedicalHistory: patientData.familyMedicalHistory ?? "",
            pastMedicalHistory: patientData.pastMedicalHistory ?? "",
            identificationType: patientData.identificationType ?? "",
            identificationNumber: patientData.identificationNumber ?? "",
            identificationDocument: identificationDocumentUrl ?? "",
            privacyConsent: patientData.privacyConsent,
        };

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_TABLE_ID!,
            ID.unique(),
            patientDocument
        );

        // Return only plain fields from the created document so it can
        // safely cross the Server → Client boundary.
        return { $id: newPatient.$id, userId: newPatient.userId };
    } catch (error) {
        console.error("Error registering patient:", error);
        throw error;
    }
}
