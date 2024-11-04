import { expect, test } from "@jest/globals";
import { pki } from "node-forge";
import * as mkcert from "../src/mkcert";

test("Create Certificate Authority", async () => {
  const ca = await mkcert.createCA({
    organization: "Test CA",
    countryCode: "NP",
    state: "Bagmati",
    locality: "Kathmandu",
    validity: 365
  });

  expect(ca.key).toBeDefined();
  expect(ca.cert).toBeDefined();
});

test("Create Certificate", async () => {
  const ca = await mkcert.createCA({
    organization: "Test CA",
    countryCode: "NP",
    state: "Bagmati",
    locality: "Kathmandu",
    validity: 365
  });

  const tls = await mkcert.createCert({
    ca: { key: ca.key, cert: ca.cert },
    domains: ["127.0.0.1", "localhost"],
    email: "abc@example.com",
    organization: "Test Cert",
    validity: 365
  });

  expect(tls.key).toBeDefined();
  expect(tls.cert).toBeDefined();
});

test("Verify Certificate Chain", async () => {
  const ca = await mkcert.createCA({
    organization: "Test CA",
    countryCode: "NP",
    state: "Bagmati",
    locality: "Kathmandu",
    validity: 365
  });

  const server = await mkcert.createCert({
    ca,
    domains: ["127.0.0.1", "localhost"],
    validity: 365
  });

  const caStore = pki.createCaStore([ca.cert]);
  const serverCert = pki.certificateFromPem(server.cert);

  expect(() => {
    pki.verifyCertificateChain(caStore, [serverCert]);
  }).not.toThrow();
});

test("Create Certificate with Date", async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const seconds_since_epoch = Math.floor(tomorrow.getTime()/1000);
  const ca_bundle = await mkcert.createCA({
    organization: "Test CA",
    countryCode: "NP",
    state: "Bagmati",
    locality: "Kathmandu",
    validity: tomorrow
  });
  const ca_cert = pki.certificateFromPem(ca_bundle.cert);
  expect(ca_cert.validity.notAfter.getTime()).toBe(seconds_since_epoch*1000);

  const tls_bundle = await mkcert.createCert({
    ca: { key: ca_bundle.key, cert: ca_bundle.cert },
    domains: ["127.0.0.1", "localhost"],
    email: "abc@example.com",
    organization: "Test Cert",
    validity: tomorrow
  });

  const cert = pki.certificateFromPem(tls_bundle.cert);
  expect(cert.validity.notAfter.getTime()).toBe(seconds_since_epoch*1000);
});