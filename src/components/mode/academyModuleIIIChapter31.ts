import type { DetailedAcademyChapter } from "./academyTypes";
import { F_LIEBIG, F_STATE_VECTOR } from "./academyFormulas";

export const CHAPTER_3_1: DetailedAcademyChapter = {
  id: "zero-cloud-telemetry",
  number: "3.1",
  eyebrow: "Module III · Chapter 3.1",
  title: "Browser-Local Architecture & the Deterministic Signal Bus",
  estimatedMinutes: 52,
  executiveLede: "Sensitive diplomatic analysis raises questions of jurisdiction, custody, endpoint trust, and the limits of browser security. This chapter studies a browser-local analytical design in which desk calculations share the MissionEngine signal bus rather than maintaining competing stores. Local computation can reduce routine disclosure to a remote application service, but it is not itself an air gap, a guarantee against browser or host compromise, or a substitute for deployment controls. The chapter therefore separates architectural choices visible in the code from risks that require institutional policy, independent testing, and physical safeguards.",
  synopsis: [
    "Remote services create data-custody, jurisdiction, and operational-dependency questions, but the existence of an overseas service does not by itself establish that a state can lawfully compel every record or defeat every diplomatic protection. Legal analysis depends on the provider, custodian, applicable process, data location, and the status of the records. The Vienna Convention's rules on mission archives do not automatically resolve a private provider's conflicts-of-law duties.",
    "The UDCA's desk calculations share one browser-side MissionEngine signal bus. That design supports a common reading chain within the application and avoids separate desk-owned copies of the same analytical output. It does not imply that every resource used to serve the website is offline, that no unrelated application feature can access a network, or that browser memory is a physically isolated enclave. Deployment and code review must establish the actual boundary.",
    "Deterministic calculation is a property to be established for defined code, inputs, and execution conditions; it is not a synonym for immutability or universal bit-for-bit identity across every device. Numeric guards in the repository provide bounded fallback behavior for specified non-finite values. They do not prove that an observation is accurate, nor do they guarantee that every source of corrupt or adversarial input has been removed.",
    "This chapter examines browser-local data-flow design, the MissionEngine's single signal chain, deterministic and auditable state transitions, and numeric guards. It also develops the limits of those controls: network and supply-chain boundaries, browser process isolation, concurrency, storage, accessibility, independent verification, and the institutional procedures needed before technical evidence can support a diplomatic decision.",
  ],
  statutoryNotice: "Statutory Directive 3.1: No mission data, bond readings, or counterpart psychological profiles shall be transmitted across any network interface or persisted in any external cloud store. All desk computations must execute strictly within browser-local volatile memory.",
  learningOutcomes: [
    "Audit the structural counter-intelligence and extraterritorial subpoena vulnerabilities inherent in commercial SaaS diplomatic platforms.",
    "Demonstrate how browser-local memory isolation satisfies the archives inviolability standard of Article 24 of the Vienna Convention on Diplomatic Relations.",
    "Analyze the unidirectional publish-and-subscribe architecture of the MissionEngine deterministic signal bus across all eighteen operational desks.",
    "Identify and remediate parallel state vulnerabilities, race conditions, and out-of-order publication risks in diplomatic telemetry.",
    "Implement canonical numeric input guards to prevent non-finite floating-point corruption from entering downstream treaty instruments.",
  ],
  sections: [
    {
      heading: "I. The Counter-Intelligence Crisis of Commercial Cloud Diplomacy",
      subheading: "Extraterritorial Jurisdiction, the CLOUD Act, and the Erosion of Sovereign Inviolability",
      paragraphs: [
        "In modern multilateral statecraft, foreign ministries and diplomatic delegations have increasingly surrendered computational independence to commercial cloud service providers. Proprietary SaaS collaboration suites, cloud databases, and centralized document repositories are routinely marketed as secure environments for high-stakes bilateral negotiations. This operational practice introduces an existential counter-intelligence vulnerability: data hosted on remote physical infrastructure is legally and physically tethered to the jurisdiction of the host nation and the corporate sovereign that administers the data center.",
        "The United States CLOUD Act amended federal law to clarify that a provider subject to United States jurisdiction may be required to preserve, back up, or disclose data within its possession, custody, or control regardless of whether the data is located inside or outside the United States, subject to statutory process and applicable challenges. That is a meaningful jurisdictional risk to assess, not a universal rule that every foreign court may obtain every record without notice or process. A sound assessment asks who controls the account, what the provider can access, which legal instruments apply, and what safeguards or conflicts procedures exist.",
        "Article 24 of the Vienna Convention on Diplomatic Relations says that the archives and documents of a diplomatic mission are inviolable at any time and wherever they may be. Its text does not state that private cloud providers are categorically outside or inside that protection, nor does it settle every question of a third party's compliance with foreign process. Whether an electronic record is a mission archive, how it is held, and what remedies are available require careful factual and legal analysis. Architecture can reduce exposure; it cannot resolve the treaty's application by assertion.",
        "Shared infrastructure creates a threat-model question, not proof that a particular tenant can read another tenant's memory. Isolation depends on hardware, hypervisor, service configuration, credentials, operational controls, and vulnerability response. Side channels and supply-chain compromise are real research areas, but claims about a specific compromise require evidence. A useful threat model distinguishes confidentiality, integrity, availability, metadata leakage, administrator access, and legal compulsion instead of treating them as one undifferentiated cloud risk.",
        "The practical design question is which calculations and records need to stay on the operator's device, which must be shared, and who can inspect the code that handles them. Browser execution can keep a particular signal calculation within a page process while the loaded application still depends on delivery infrastructure, identity services, browser updates, and the operating system. Locality narrows selected data paths; it does not confer absolute custody or make an endpoint trustworthy by declaration.",
      ],
      caseStudy: {
        title: "Operation Rubicon and the Fallacy of Neutral Third-Party Custody",
        jurisdiction: "International Bilateral Statecraft / Swiss-German Corporate Domain",
        precedent: "Compromised diplomatic cryptography via Crypto AG (1970–2018)",
        analysis: [
          "In 2020, reporting based on declassified material described a long-running intelligence operation in which the CIA and West German BND secretly controlled Crypto AG and exploited weaknesses in some of its encryption products. Crypto AG equipment was used by governments around the world, but the history should not be reduced to the unsupported claim that every product or every customer's messages were readable in every period. The precise scope varied by machine, customer, and cryptographic configuration.",
          "The case is relevant to architecture because users relied on a supplier whose assurances and ownership structure they could not independently assess. A hidden weakness in a cryptographic product can defeat the purpose of encryption even when a buyer sees ciphertext on a network. This is a supply-chain and governance failure, not direct evidence that every commercial cloud provider has comparable access or intent.",
          "Popular accounts connect the intelligence operation to major diplomatic and military events, but a curriculum should avoid attributing specific negotiating outcomes or claiming complete, real-time access without a traceable source for each assertion. The case supports the narrower inference that vendor trust, independent evaluation, key custody, and oversight matter. It does not by itself establish what any particular delegation knew or why a particular policy decision was made.",
          "Operation Rubicon is therefore a warning about opaque dependencies and concentrated trust, not proof that all third-party infrastructure will inevitably be subverted. A contemporary assessment must test the actual service and deployment, identify the adversary's capabilities, and weigh independent evidence. Local execution can reduce selected disclosures, while still requiring trusted code delivery, endpoint controls, identity protection, update governance, and recovery planning.",
        ],
        failureMechanism: "Customers could not independently detect that a trusted supplier was controlled by intelligence services and that weaknesses had been introduced into some products. The case illustrates supply-chain opacity and the limits of relying on vendor assurances alone.",
      },
      subsections: [
        {
          title: "The Mechanics of Foreign Subpoena Vectors and Clandestine Interception",
          paragraphs: [
            "When diplomatic telemetry is transmitted across public telecommunications networks to centralized cloud endpoints, its route and custodians create questions about interception, jurisdiction, and metadata exposure. Network operators and governments may have lawful process or technical capabilities relevant to particular links, but the existence of an intermediate router or cable does not establish that a specific communication was intercepted. Transport encryption protects the connection while in transit; where it terminates, who can access plaintext, and whether application-level encryption is used depend on the service design and key custody.",
            "Once ingested into cloud database clusters, diplomatic data becomes subject to database administrative logging, automated indexing, snapshot backups, and telemetry diagnostics. Even when client-side customer managed keys are utilized, the metadata of diplomatic interaction (the frequency of desk updates, the identities of seated analysts, the timestamps of concession adjustments, and the structural variance of bond scores) leaks through access patterns and memory allocations. Hostile statistical inference engines can reconstruct diplomatic breakthroughs or impending impasses merely by observing the cadence and volume of encrypted packets leaving an embassy compound.",
            "A browser-local calculation can avoid sending its inputs to an application service if the relevant code path performs no such transmission; that claim must be established by inspecting the shipped bundle, dependencies, service workers, and runtime network behavior. It does not establish that the page made no request to load assets or authenticate, or that browser extensions and host software cannot observe the page. A deployed offline copy may remove some network dependencies, but its provenance, update process, and local peripherals remain part of the threat model.",
          ],
          callout: {
            kind: "warning",
            title: "The Illusion of Foreign SaaS Enclaves",
            paragraphs: [
                "Dedicated regions and virtual private clusters can change the risk profile, but neither label proves legal immunity or technical isolation. Review the provider's control plane, administrative access, key custody, logging, backup behavior, incident response, and applicable law. A cloud service may be suitable for some data and not others; the decision should follow classification and threat assessment rather than a categorical slogan.",
                "Physical separation can remove selected network routes, but an air gap is an operational condition that must be verified, maintained, and reconciled with software updates and removable media. Browser-local execution is not equivalent to an air gap: the browser has networking APIs, the host may be connected, and a malicious or compromised extension may act in the same user environment.",
            ],
          },
        },
        {
          title: "A Jurisdictional Matrix Rather Than a Cloud Slogan",
          paragraphs: [
            "A postgraduate legal-technical review begins by drawing a custody map. Identify the data subject, account holder, contracting ministry, service provider, sub-processors, encryption-key holder, and every party able to administer the service. Then distinguish the physical location of a storage medium from the legal domicile of the custodian and the place where a disclosure request is issued. These locations can overlap, but they are not interchangeable. The location of a server alone rarely answers who can access a record, which legal process applies, or what remedies the affected state can invoke.",
            "The United States CLOUD Act is one jurisdictional example, not a universal instrument of global surveillance. Its amendments address providers subject to United States jurisdiction and data within their possession, custody, or control; statutory mechanisms also provide avenues to challenge certain demands. Mutual legal assistance treaties, executive agreements, data-protection rules, sanctions, secrecy obligations, and conflict-of-law doctrine may all matter in a particular fact pattern. A defensible risk assessment cites the applicable instrument and makes its assumptions explicit instead of asserting that a provider's headquarters automatically decides every question.",
            "The Vienna Convention on Diplomatic Relations is similarly important but should not be transformed into a technical encryption guarantee. Article 24 protects mission archives and documents wherever they may be; it does not prescribe cloud architecture, define every digital custody relationship, or by itself describe a provider's response to a warrant. The legal question whether a given file remains a mission archive is different from the technical question whether a provider can read it. Both deserve analysis, and neither can be settled by calling infrastructure sovereign.",
            "For a negotiation, a useful matrix records data category, origin, controller, storage location, encryption at rest and in transit, key control, service access, retention, backup, legal process, and deletion method. Mark unknowns rather than filling them with optimistic assumptions. A data-flow diagram can then show which records need to leave the device, which can remain local, and which may be safely shared in redacted form. That disciplined inventory is more useful to counsel and security officers than an unsupported assertion that either cloud or local computing is inherently secure.",
          ],
        },
        {
          title: "Threat Modeling Confidentiality, Integrity, Availability, and Metadata",
          paragraphs: [
            "The word security conceals several different objectives. Confidentiality asks who can learn the content; integrity asks whether content or computation can be changed without detection; availability asks whether authorized users can access the system when needed. Authenticity concerns the source of a message or artifact, while accountability concerns whether actions can be attributed with appropriate evidence. A system can improve one objective while worsening another: disconnected devices reduce some remote exposure but can make updates and recovery difficult, while a central service may simplify administration but increase concentrated custody and outage risk.",
            "Metadata deserves separate treatment. A service may not receive the text of a confidential draft yet still observe account identifiers, access times, file sizes, interaction frequency, device information, and network addresses. Patterns can disclose that a delegation is active, which participants are engaged, or when a draft changed. Conversely, a local-only calculation may still create local browser storage, logs, screenshots, operating-system caches, clipboard entries, or backups. The threat model should list these artifacts and adversaries rather than presume that a lack of application payload upload eliminates all evidence.",
            "Attack trees help translate abstract risks into reviewable paths. For each protected asset, ask how an adversary could obtain it through a compromised account, provider administrator, supply-chain update, browser extension, malicious script, unattended device, stolen backup, or coercive legal demand. For each path, record prerequisite capability, relevant control, residual risk, detection method, and recovery plan. Do not equate theoretical feasibility with demonstrated exploitation: a credible assessment labels evidence, likelihood, and uncertainty rather than using vivid attack language as proof.",
            "The architecture review should also include benign failures. A browser crash, battery exhaustion, damaged profile, service outage, mistaken purge, or inaccessible clipboard can impair a real delegation as surely as a malicious actor. Redundant authorized copies, controlled recovery, backup encryption, version compatibility, and rehearsed incident procedures may therefore be necessary. Security engineering is not a competition to maximize isolation; it is the design of proportionate controls against stated risks while preserving lawful access and operational continuity.",
          ],
        },
        {
          title: "From Historical Analogy to Evidence-Based Inference",
          paragraphs: [
            "The Crypto AG history is a useful case for examining trust in a vendor, but it does not establish that every hosted platform is compromised or that every client-side application is safe. Historical cases support propositions at the level of mechanisms: a supplier can be subverted, commercial assurances can be misleading, and customers may lack visibility into a black-box system. Moving from that example to a claim about a present-day service requires additional evidence, such as architecture documentation, independent audits, contract terms, known vulnerabilities, or observed network behavior.",
            "That distinction matters in postgraduate writing because case studies often become rhetorical shortcuts. A reader may remember the dramatic label and infer that a particular threat is inevitable. Replace that shortcut with a chain of reasoning: identify the documented event, state what evidence supports it, name the technical or institutional mechanism, and explain which part of the current design is analogous. Then note what is not analogous, including different cryptographic designs, jurisdictions, access controls, or threat actors.",
            "The same evidence discipline applies to claims of counter-intelligence success. A negotiation outcome that follows a technology deployment does not demonstrate that the technology caused the outcome. Establishing causation would require a defensible counterfactual and evidence about decision-makers' information, the operation of the system, and other intervening events. When those facts are unavailable, frame the case as an illustration of a plausible failure mode or as an interpretive comparison rather than as a proven causal precedent.",
            "A responsible chapter can still use history to sharpen design questions. The case prompts the reader to ask who designs a tool, who can inspect it, how change is governed, and what independent party can validate a security claim. It does not answer those questions for a modern web application. The engineering analysis that follows must therefore be grounded in platform standards and the repository's actual data flow, with historical material serving as context rather than substitute evidence.",
          ],
        },
        {
          title: "Security Requirements as Verifiable Claims",
          paragraphs: [
            "A requirement such as 'no mission data leaves the browser' is not verifiable until its terms are defined. Does 'mission data' include application state only, authentication claims, crash reports, request URLs, content-security-policy reports, analytics, or browser synchronization? Does 'browser' include a browser extension with host permissions? Does 'leave' mean no application request, no operating-system backup, or no packet on a network interface? A carefully scoped claim states the tested boundary, included data classes, deployment version, and exceptions.",
            "The claim can then be translated into evidence. Static review searches for network APIs, remote libraries, service-worker fetch handlers, telemetry SDKs, and external form actions. Runtime review records requests during representative workflows, including authentication, save, restore, export, and error handling. Network policy can provide a second enforcement layer, while build review verifies that the analyzed source corresponds to the deployed bundle. A single browser developer-tools capture is useful but limited: it cannot demonstrate the behavior of every build, extension, operating-system service, or future update.",
            "Negative requirements need especially careful tests. A test that observes no request during one scenario proves only that no request was observed in that scenario under those conditions. It does not establish a universal absence across all code paths. Use a coverage plan that identifies user actions, error states, browser versions, and deployment modes. Preserve the test artifacts and record what the monitoring could not see. An assurance statement should report both evidence and residual uncertainty.",
            "Versioning is part of the claim. A released build can be audited, but the next deployment may change a dependency, CSP header, authentication route, or service-worker behavior. Release provenance, change review, checksums, rollback procedures, and periodic retesting convert a one-time finding into a maintained assurance process. In diplomatic use, the person authorized to accept residual risk should receive this record in plain language, not only a technical appendix.",
          ],
        },
        {
          title: "Custody Agreements and Data Governance",
          paragraphs: [
            "Technical locality is only one dimension of data governance. A mission team still needs rules for classification, access, reuse, retention, correction, export, and eventual deletion. The agreement should name the information owner, the operators allowed to view each class, the purpose for which the data may be used, and the authority that can approve a transfer. These are institutional controls; a browser sandbox cannot decide them on behalf of the ministry.",
            "A data inventory should distinguish raw source evidence from analyst annotations, calculated signals, decision records, and exported reports. Each representation may carry a different sensitivity and retention need. A calculated score can reveal a strategic assessment even when it contains no source text, while a public document may become sensitive when linked to a named counterpart or negotiation date. Classification should therefore consider content, context, linkage, and potential inference.",
            "Data minimization asks whether every field is necessary for the decision and whether a less identifying representation would suffice. It also asks whether persistent identifiers, precise timestamps, and free-text biographies are needed. Reducing collection limits the consequences of a lost device and reduces the number of people and processes that need access. Minimization must not remove evidence required for legal accountability or create a misleadingly incomplete audit trail.",
            "Access control should be explicit even when the application is used on one workstation. A shared login obscures who entered a value; a visible account name does not prove that the account holder was at the keyboard. Where reliable attribution is required, use individual credentials, session policy, controlled handover, and records that identify the operator under an approved process. Avoid claiming non-repudiation from local browser state alone.",
            "Retention rules should cover normal and exceptional paths: completed mission, abandoned negotiation, device loss, staff departure, legal hold, and incident investigation. A purge function can clear selected application stores, but it does not determine the lawful retention period. Conversely, an archival obligation does not mean every operator should keep a plaintext copy on a laptop. Use a protected records system with access policy where durable evidence is required.",
            "Data transfers deserve their own review. Exports, screenshots, copied excerpts, email attachments, removable media, and printed handouts may bypass the MissionEngine's local data path. Before export, identify the recipient, purpose, classification, minimization, encryption, and logging requirement. A local calculation bus cannot constrain what a user later copies from the screen, so procedures and technical controls must cover the entire information lifecycle.",
          ],
        },
      ],
      formulas: [F_STATE_VECTOR, F_LIEBIG],
      statutoryRule: "Rule 3.1-A: No operational telemetry, state vector coordinates, or counterpart psychological profiles shall be transmitted across any network interface or persisted in any external database. All mission processing must execute within local browser memory.",
    },
    {
      heading: "II. The Architecture of Zero-Cloud Computational Sovereignty",
      subheading: "Volatile Memory Isolation, Air-Gapped Integrity, and Client-Side Invariance",
      paragraphs: [
        "A browser-local design places the application logic and selected state in the client execution environment. In this repository the MissionEngine describes itself as a browser-side bus, and desk components use its publish/read abstractions. That is a statement about the computation and data flow represented by this code, not a claim that every route, authentication path, asset request, or storage feature is network-free. A production deployment must inspect network requests and hosting configuration before making a zero-cloud assurance.",
        "Browser security models provide origin isolation and implementation-specific process protections, but the web platform does not promise a dedicated hardware enclave for each page. A page shares a device with its browser, extensions, operating system, and other software. JavaScript objects may be copied, garbage-collected, serialized, or retained by debugging facilities. Clearing a reference or overwriting a typed array can reduce exposure for that buffer; it cannot prove that every copy has vanished from physical media or memory.",
        "A packaged web application can be deployed in an offline environment only if the assets and all required dependencies are present and the deployment is tested without network access. A static host is not an air gap; an offline workstation is not secure merely because a browser tab has no active connection. The operational plan must account for code signing or other provenance controls, vetted updates, backups, removable media, device custody, and accessibility to the authorized operator.",
        "Local computation may improve availability when a service is unreachable, because arithmetic does not need a round trip to a server. But offline functionality has to be tested for each workflow: authentication, saved workspace recovery, cryptographic operations, fonts and other assets, and data export can have separate dependencies. Network denial can also prevent security updates or revocation checks. Availability, confidentiality, and freshness are distinct properties and should be assessed independently.",
        "Client-side code is inspectable in principle, but developer tools alone do not prove that the loaded bundle is the reviewed source or that dependencies and build pipelines are trustworthy. A credible integrity program needs reproducible or otherwise verifiable builds, signed release provenance, dependency review, change control, and independent testing. A local deterministic formula can still embody a flawed assumption or an undesirable policy choice; transparency enables scrutiny but does not guarantee objectivity.",
      ],
      subsections: [
        {
          title: "The Failure of Multi-Tenancy in Sovereign Statecraft",
          paragraphs: [
            "Multi-tenancy is the foundational economic architecture of commercial cloud computing. By pooling computational resources across thousands of distinct enterprise customers on shared physical hardware, cloud providers maximize hardware utilization and operational profitability. However, multi-tenancy introduces profound security vulnerabilities that are fundamentally incompatible with sovereign statecraft.",
            "Microarchitectural side-channel attacks exploit speculative execution mechanisms within modern central processing units to leak memory contents across virtual machine boundaries. In a multi-tenant cloud environment, a sophisticated state-sponsored actor can lease a virtual machine on the same physical server as a targeted foreign ministry and extract sensitive cryptographic keys or mission telemetry directly from processor caches.",
            "By enforcing zero-cloud client execution, the UDCA guarantees that the analytical workload executes exclusively on single-tenant physical hardware under the direct physical security perimeter of the sovereign delegation. The delegation does not share processor caches, memory controllers, or operating system kernels with unknown commercial or adversarial tenants.",
          ],
          callout: {
            kind: "statutory",
            title: "Statutory Air-Gap Mandate",
            paragraphs: [
              "When an operational mission is classified under Elevated or Critical sensitivity, the analytical terminal must be physically disconnected from all local area networks, cellular interfaces, Bluetooth controllers, and wireless antennas.",
              "The browser-local runtime retains full analytical functionality in an air-gapped state, proving that mathematical rigor and operational security do not require network connectivity.",
            ],
          },
        },
        {
          title: "The Browser Is a Security Boundary, Not a Hardware Vault",
          paragraphs: [
            "The browser same-origin policy limits many forms of cross-origin script access, and browser vendors deploy process separation and sandbox mitigations. The exact implementation varies by engine, platform, site-isolation policy, and version. The web platform's origin model is not a guarantee that every page runs on a unique physical core or that JavaScript memory is inaccessible to privileged software. Treat it as one layer in a defense-in-depth architecture, not as proof of hardware-backed confidentiality.",
            "A page executes within a larger trust chain: firmware, boot process, operating system kernel, browser binary, extensions, installed certificates, input method, display system, and update channel. An administrator or malicious process with sufficient privilege can record keystrokes, inspect process memory, take screenshots, or replace application assets. A compromised browser extension may receive broad page access depending on permissions. A local threat assessment should enumerate these actors and decide which are in scope rather than saying the browser 'isolates' them away.",
            "The browser sandbox still has value. It constrains web content relative to the host and other origins, reduces the consequences of many vulnerabilities, and provides standardized APIs for storage, networking, and cryptography. But a web page is not a separate operating-system user, and a sandbox escape remains a browser vulnerability class. The correct claim is that browser controls can mitigate classes of risk under assumptions about the browser and host; assurance depends on keeping those assumptions current.",
            "For sensitive analytical sessions, endpoint configuration may be as consequential as application code. Consider managed devices, full-disk encryption, screen locking, verified updates, extension allowlists, removal of unnecessary applications, secure boot where available, and physical custody. These controls do not make a machine invulnerable. They reduce exposure and support detection, while procedures define how operators respond to loss, unexpected prompts, power interruption, or a suspected compromise.",
          ],
        },
        {
          title: "Air Gaps, Offline Builds, and Supply-Chain Provenance",
          paragraphs: [
            "An air gap is a claim about connectivity and operating procedure, not a feature supplied by a browser. To substantiate it, identify all network-capable interfaces, including wired Ethernet, Wi-Fi, Bluetooth, cellular modems, management controllers, tethered phones, and removable network adapters. Inspect the machine's configuration and physical environment. A device can be offline during a session yet have received an unreviewed update or bundle earlier through removable media; that supply path is part of the security boundary.",
            "A static site can be mirrored for offline use, but its source assets, dependency graph, build environment, and release signatures still require validation. A mirror may differ from the audited source; a compromised build dependency may insert behavior before the application code is reviewed. Pinning dependencies, generating a software bill of materials, reviewing changes, validating release checksums through an independent channel, and keeping a reproducible build record are ways to strengthen provenance. They are controls, not proofs that no malicious code exists.",
            "Offline operation changes the patching problem. A machine that cannot contact update services may remain exposed to known browser vulnerabilities, outdated cryptographic implementations, or revoked credentials. Establish an authorized update cadence, a signed media-transfer process, malware scanning appropriate to the environment, and a record of what was transferred. Also decide how the team will verify a new application version without contacting an untrusted external host during a high-security mission.",
            "Availability tests must include the exact offline workflow. Confirm that all assets load without external requests, that necessary records can be recovered, that no authentication step silently depends on a hosted identity service, and that cryptographic operations work in the supported secure context. A successful page render is not equivalent to a successful mission workflow. The test should include restart, browser update, recovery, export, and controlled emergency shutdown.",
          ],
        },
        {
          title: "Data Minimization and Retention by Lifecycle",
          paragraphs: [
            "Data minimization starts by asking whether a field is needed at all. A dashboard that stores a full counterpart biography when an assessment needs only a cited negotiating position creates unnecessary privacy and security costs. The data inventory should distinguish source material, analyst interpretation, derived score, decision record, and presentation label. Each class can have a different retention period, access group, and deletion requirement. Minimization is not only about reducing bytes; it reduces the number of people and processes that must be trusted.",
            "The browser exposes multiple storage mechanisms with different lifetimes. JavaScript heap objects are subject to garbage collection; sessionStorage is scoped to a page session but persists across reloads and may be restored with a session; localStorage is origin-scoped persistent storage; IndexedDB stores structured records; downloads and clipboard contents can outlive the tab. Browser profile synchronization and operating-system backups may create further copies. A user interface label such as 'volatile' should never be taken as a technical description of every artifact.",
            "Retention design should specify what happens on normal exit, tab closure, browser crash, idle lock, panic action, account sign-out, device loss, and storage failure. It should also distinguish deleting an application's reference from overwriting a buffer, removing a storage key from a profile, and sanitizing a storage medium. Each action has different guarantees. If a browser denies a clipboard write or storage access, the interface should report failure rather than implying successful erasure.",
            "Recovery introduces a deliberate tension: retaining encrypted workspace state can protect against accidental loss but creates a recoverable artifact that must be safeguarded. A useful policy defines encryption, key custody, backup scope, maximum retention, recovery authorization, and destruction procedure. The choice should be based on the consequences of both premature deletion and unauthorized recovery. There is no universal 'zero data' setting that eliminates this governance decision.",
          ],
        },
        {
          title: "Human Factors and Operational Security",
          paragraphs: [
            "Technical controls fail when operators cannot use them under pressure. A lockout that triggers during a critical briefing may encourage staff to disable it; a panic gesture that conflicts with browser shortcuts may create accidental purges; an offline update procedure that is too cumbersome may be bypassed. Human-factors review should therefore include realistic task observation, language and accessibility needs, keyboard-only operation, stress, fatigue, and multi-operator handover. The right outcome is not maximal friction but predictable secure behavior.",
            "Security training should explain the difference between 'local' and 'private.' Local data may be accessible to anyone with the unlocked device, browser profile, or operating-system account. Conversely, a shared service can enforce role separation and audit access if properly designed. Operators need practical guidance on screen positioning, removable media, observed browser changes, unexpected extension prompts, and what to do when a device is seized or left unattended.",
            "A response plan should specify who may isolate a device, notify the security lead, rotate credentials, preserve evidence, and authorize recovery. Panic purging may be appropriate where confidentiality takes priority over forensic preservation, but incident responders sometimes need a lawful evidence-preservation path. Policies should state when to use each route. The software cannot decide that tradeoff for every diplomatic context.",
            "Finally, measure whether safeguards work in practice. Tabletop exercises can introduce lost-device, offline-update, shared-terminal, and unexpected-network scenarios. Record time to lock, time to identify a canary alert, the rate of false positives, and whether authorized recovery succeeds. These measurements should inform design changes and training. They should not be advertised as absolute security guarantees.",
          ],
        },
        {
          title: "Building an Offline Deployment Without Creating a False Air Gap",
          paragraphs: [
            "An offline deployment begins with an explicit boundary diagram. Identify the workstation, browser, operating system, asset bundle, authentication component, storage mechanism, network interfaces, removable media, clipboard, and any separate service. Mark which components are present during the exercise, which are disabled, and which remain trusted by assumption. A label such as 'offline' is not a substitute for documenting how the device reached that state.",
            "Prepare a release from reviewed source and preserve its provenance. Record the repository revision, dependency lockfile, build environment, artifact hash, approver, and date. If the artifact is transferred on removable media, record who produced it, how the recipient verifies it independently, and how the media is scanned and controlled. A malicious or simply stale bundle can be delivered over an air-gapped process just as easily as a clean one.",
            "Exercise the complete workflow with network access removed. It should include the actual login route, required assets, every critical desk, persistence and recovery, seal calculation, PDF export, clipboard operations, idle lock, and panic response. Capture requests or blocked connection attempts where possible. If a function is unavailable offline, disclose that limitation rather than assuming it will work because the main dashboard rendered.",
            "Offline operation does not eliminate dependency risk. Browser versions, operating-system components, certificate stores, and embedded libraries still require patching. Design an update cadence that balances exposure to known vulnerabilities against supply-chain risk. The update procedure should validate signatures or hashes through a separate trusted channel, document the installed version, and provide a rollback plan.",
            "An air gap also changes identity and support. If an online identity service is unavailable, the organization needs a controlled local access method with enrollment and revocation policy. If the endpoint is isolated, remote monitoring and incident reporting may be unavailable. Define how the operator obtains help, communicates a suspected compromise, and recovers a workspace without connecting to an unauthorized network.",
            "The release should be re-tested after changes to the build, dependencies, headers, identity path, storage mode, or browser support. Each test report should identify the exact artifact and device configuration. A prior test cannot be carried forward to a different build merely because the visible interface looks similar. This keeps the claim tied to evidence rather than to a product name.",
          ],
        },
      ],
      statutoryRule: "Rule 3.1-B: The analytical suite shall maintain full operational and mathematical functionality in a completely disconnected, air-gapped hardware state without performance degradation.",
    },
    {
      heading: "III. The Deterministic Signal Bus (MissionEngine Architecture)",
      subheading: "Single-Chain Propagation, Elimination of Parallel Stores, and Unidirectional Flow",
      paragraphs: [
        "A foundational defect of traditional diplomatic software architecture is the proliferation of parallel state stores. In fragmented systems, the military assessment unit maintains one database of border skirmishes; the trade delegation maintains an independent spreadsheet of tariff concessions; the political liaison updates an isolated contact ledger; and the legal team drafts treaties against obsolete versions of annex agreements. When senior principals convene to formulate a unified negotiating posture, they are confronted with irreconcilable discrepancies, divergent figures, and conflicting assessments.",
        "The UDCA eradicates state fragmentation through a unified architectural pattern: the MissionEngine deterministic signal bus. The signal bus serves as the sole, authoritative communications channel connecting all eighteen operational desks across the four divisional tiers. Rather than allowing individual desks to establish independent databases or cross-link directly with one another through ad-hoc event listeners, all analytical telemetry is published to and read from a single centralized bus structure.",
        "The MissionEngine provides a shared publish-and-read path for desk readings. When an analyst enters observations on Desk 01 (Diagnostics and Pattern Matching), the canonical desk function computes the four-dimensional state vector \\(B = (B_{\\text{interpersonal}}, B_{\\text{communal}}, B_{\\text{intergenerational}}, B_{\\text{institutional}})\\), the arithmetic mean \\(\\mu_{B}\\), the population variance \\(\\sigma_{B}^{2}\\), and the Liebig limiting bond \\(B_{\\min}\\). The desk publishes its result for downstream consumers such as Desk 02, Desk 03, and Mission Readiness. Publication creates shared application state; it does not make the payload immutable or independently verify the observations.",
        "The architecture distinguishes authoritative desk publications from consumer views, but it is not accurate to say that no shell component can publish: defined shell publishers, such as mission and preset selection, are exempt from the custom-mission engagement rule. Signal Inspector reads through its monitor and does not publish; other components should be assessed against their actual interfaces. A view that needs the Dominum Index should read the derived bus value rather than implement a second formula.",
        "A single signal chain can reduce accidental divergence, duplicated calculations, and some classes of update inconsistency. It cannot eliminate all races or guarantee an identical view at every instant. Asynchronous persistence, event scheduling, component lifecycle, stale revisions, and partial updates still require tests and explicit state handling. Operators may also view different mission phases or workspace revisions, so the interface should disclose context when it matters.",
      ],
      caseStudy: {
        title: "Rambouillet Negotiations: A Caution Against Treating Diplomatic Failure as a Data Problem",
        jurisdiction: "International Diplomatic Mediation / Federal Republic of Yugoslavia & Kosovo",
        precedent: "Interim Agreement for Peace and Self-Government in Kosovo (1999)",
        analysis: [
          "The February 1999 Rambouillet talks brought together representatives of the Federal Republic of Yugoslavia and Kosovo Albanian leadership under Contact Group mediation. The process addressed political arrangements, implementation, security, and the role of an international presence. The parties' positions and the proposed terms were contested; a technical account should distinguish the text of the draft from later political interpretations.",
          "The negotiations are not evidence that parallel word processors or unsynchronized digital annexes caused the breakdown. Claims of a specific document-control failure require documentary sources, and the available account here does not establish one. The case is better used to examine how parties can disagree over connected political and military provisions, and how a proposal's legal and operational meaning depends on its complete text and negotiating context.",
          "The military implementation provisions, including the proposed status and movement of an international force, became a major point of dispute. Characterizations such as 'total occupation' are interpretations, not neutral descriptions of the draft. The talks did not produce an agreement accepted by all parties; the subsequent Kosovo conflict and NATO air campaign had complex diplomatic, legal, and military causes that should not be reduced to a single drafting defect.",
          "For software design, the cautious lesson is that shared access to a current document can reduce accidental version divergence, but cannot resolve disagreement about meaning, authority, or acceptable terms. A unified signal bus could make selected analytical values consistent within an application. It could not decide whether a proposal was fair, lawful, or politically acceptable, nor establish that a failed negotiation would have succeeded with better state synchronization.",
        ],
        failureMechanism: "The negotiation failed to yield an accepted agreement amid substantive disputes over political arrangements and implementation. The case does not establish that a document synchronization failure caused the outcome.",
      },
      subsections: [
        {
          title: "The Prohibition Against Parallel Stores and View-Layer Math",
          paragraphs: [
            "In poorly architected software systems, user interface components frequently re-implement mathematical calculations locally to format displays or trigger visual alerts. For example, a status badge might calculate its own approximation of the Rupture Index using simplified logic rather than reading the authoritative figure from the core engine. Over time, as formulas are updated in the engine, the view layer becomes desynchronized, leading to situations where a gauge displays a green Viable status while the underlying mathematical engine has already tripped a red Critical alarm.",
            "The UDCA enforces a zero-tolerance architectural invariant: no view component may ever calculate, approximate, or cache operational telemetry. All mathematical transformations occur within canonical engine functions, are published to the MissionEngine signal bus, and are consumed as read-only values by user interface components. The view layer is a purely passive mirror of mathematical reality.",
            "This principle extends to the Chancellery Wire, the Signal Inspector, and the Decision Log. When an operator opens the Signal Inspector to examine live telemetry, the inspector queries the bus through the read-only monitor. It possesses no authority to modify signals, inject synthetic values, or override desk publications. Truth flows strictly from the analytical desks through the bus to the presentation layer.",
          ],
          callout: {
            kind: "definition",
            title: "The Deterministic Bus Invariant",
            paragraphs: [
              "Let \\(S_{t}\\) represent the complete state vector of the MissionEngine bus at time \\(t\\). For any desk \\(D_{k}\\) and any valid operator input \\(I\\), the subsequent state \\(S_{t+1} = \\text{Engine}(S_{t}, D_{k}, I)\\) is a pure mathematical function possessing zero side effects, zero network dependencies, and complete reproducibility across all client runtimes.",
            ],
          },
        },
        {
          title: "Reading the MissionEngine as a Data-Flow Contract",
          paragraphs: [
            "A signal bus is not merely a shared JavaScript object; it is a contract about ownership and direction. In the MissionEngine pattern, a desk that has authority over a measurement computes it through the desk's canonical function and publishes the resulting reading under a defined signal key. A consumer obtains the value through the engine interface and derives only presentation or workflow decisions permitted to it. This separation makes it possible to trace a displayed number back to its producer and formula rather than reverse-engineering a second calculation from a chart.",
            "The contract should be documented for each signal: canonical name, semantic definition, unit, domain, null or missing behavior, authoritative publisher, allowed consumers, and lifecycle. A field named `risk` is insufficiently precise if one desk means probability and another means consequence. A value's unit and observation window belong in the contract. Where the engine represents an explicit clear, consumers must distinguish that from an absent publication; treating both as zero may manufacture evidence or preserve stale data.",
            "The bus does not make a judgment true because it is centralized. It can faithfully propagate a wrong source, stale field observation, biased categorization, or mistaken unit. Centralization improves consistency of the representation, not correctness of the world model. Each publication should be attributable to its input, calculation version, and operator context where the application supports that provenance. Human review remains necessary to decide whether the evidence is credible and whether an assumption is fit for a particular decision.",
            "The safest architectural review follows one reading end to end. Start at the instrument input; identify sanitization; find the canonical engine function; inspect its tests and threshold; trace publication; then inspect downstream subscriptions and views. Check that the view does not recompute the formula, silently coerce a missing value, or keep a second durable copy. This concrete trace is more informative than a diagram that simply labels one component 'the bus.'",
          ],
        },
        {
          title: "Provenance, Versioning, and Stale-Reading Control",
          paragraphs: [
            "An assessment is meaningful only in context. A bond value may be mathematically valid and still be stale, derived from a superseded source, or recorded against the wrong negotiating phase. A bus schema should therefore consider provenance dimensions such as observation time, source date, author, confidence, review status, unit, and schema version. Not every field belongs inside a signal, and excessive metadata can expose sensitive information; the design should select only what is needed to interpret and audit the reading.",
            "Versioning matters because a formula may evolve. If a later release changes a threshold, a previously sealed state vector may not be comparable to a new result produced under different semantics. A robust migration plan records the formula or schema version, defines whether historical values are reinterpreted, and preserves the original representation for audit. Silent reinterpretation risks attributing a new policy to an earlier decision.",
            "Staleness can be represented as an explicit state rather than a guessed correction. A consumer may show 'last assessed at' and warn that a required publication is outdated, while avoiding an invented numerical penalty unless the engine defines one. Timestamp logic itself needs a time source and timezone policy. Wall-clock time can move, device clocks can be incorrect, and a timestamp is not an independent time-stamping authority merely because it is rendered in UTC.",
            "In a single-browser workflow, asynchronous operations can still complete out of order. An expensive calculation, user action, storage write, or worker response may race with a newer change. Revision numbers, cancellation, and latest-result checks help ensure that an old completion does not overwrite the current signal. A UI should make loading and failure states visible; showing a prior value without indicating that it is stale can mislead a decision-maker even when the bus itself behaves deterministically.",
          ],
        },
        {
          title: "Bus Boundaries, Custom Missions, and Publication Authority",
          paragraphs: [
            "A uniform signal bus can contain many analytical desks while still respecting that a desk has not yet been assessed. In Custom Operational Missions the stated application rule is that a desk's initial publications are dropped until an operator first works that desk; shell-level mission and preset publishers are exempt. This distinction prevents a desk's default demonstration values from masquerading as a fresh assessment. It is an important example of semantic state: 'a value exists in code' and 'an operator has supplied evidence' are not equivalent.",
            "The engagement boundary should be auditable. A desk becomes worked through an input, a change, or a control click inside its own surface; unrelated shell actions must not accidentally authorize its default output. A test plan should verify both positive cases (the intended desk's publication reaches consumers after engagement) and negative cases (untouched desks do not publish their starting values). Tests should also check that switching between mission modes does not create a shadow store or bypass the ordinary path.",
            "The mode shell is a consumer and coordinator, not a second authority for desk arithmetic. Reading bus signals to present readiness or route to a selected phase is distinct from publishing new readings. Shell-owned settings such as a theatre preset have an explicit publisher exemption, but that exception should remain narrow and documented. Broad exceptions can quietly turn a presentation shell into a parallel assessment engine.",
            "These boundaries support fair interpretation. A blank signal can mean not yet assessed, not applicable, deliberately cleared, or failed to load; the domain model must not collapse those meanings without an explicit rule. The curriculum should teach operators to inspect signal provenance and readiness status before relying on an aggregate score. No aggregate should imply that every desk has contributed comparable evidence unless the application says so and the record confirms it.",
          ],
        },
        {
          title: "Testing Determinism Without Claiming Immutability",
          paragraphs: [
            "Determinism is testable when its scope is precise. Given fixed normalized inputs, fixed formula version, and the same specified environment, a pure calculation should produce the same result. Unit tests can assert expected values at boundaries, property tests can explore ranges and combinations, and regression fixtures can capture known scenarios. A cross-browser comparison can reveal serialization or floating-point differences. Such tests support confidence in the defined computation; they do not prove that the entire user session is immutable or that two devices share identical state.",
            "Immutability is a separate property. A frozen value may prevent certain accidental mutations within one object graph, but it does not prevent replacement of the enclosing state, a malicious script from calling another API, or a user with host privileges from changing the runtime. An append-only user interface likewise is not necessarily an append-only evidence store. Claims should name the mechanism and threat it addresses, such as a read-only component contract or a cryptographic digest, rather than describing the entire bus as immutable.",
            "A practical test matrix covers same input in different insertion orders, explicit undefined clears, arrays whose order is meaningful, nested object updates, non-finite numeric cases, repeated publication, rapid operator changes, mode switches, and unmount/remount behavior. Tests should verify that canonical functions are called and that consumer views receive the expected published value. If user-interface selectors or proof panels have their own mathematical implementations, compare them against the canonical engine rather than accepting visual similarity.",
            "Concurrency and persistence tests are just as important as arithmetic tests. Simulate a delayed save for revision one followed by a newer revision two; confirm the first completion cannot mark the second clean. Simulate page visibility changes, storage quota errors, rejected writes, and browser refresh. The aim is not to make every failure impossible, but to ensure failure is observable and does not silently manufacture a plausible-looking assessment.",
          ],
        },
        {
          title: "Signal Contracts, Schema Evolution, and Consumer Safety",
          paragraphs: [
            "A signal contract should define the producer, consumers, data type, unit, range, meaning, and update semantics. It should specify whether the publisher may clear a value with explicit undefined, whether an empty array is meaningful, and whether a publication is complete or partial. These distinctions determine how a downstream desk behaves; they are not cosmetic details for a type declaration.",
            "Schema evolution should preserve compatibility deliberately. Adding a signal may be safe for consumers that ignore unknown fields, while renaming a key can strand existing readers. Changing a number's unit without changing its name is especially dangerous. A versioned schema and migration tests prevent old stored workspaces from being interpreted as if they were created under the new semantics.",
            "Consumers should validate at the boundary without reimplementing the producer's formula. They can check that a value is present, finite, and has the expected shape, then display an explicit error or unavailable state. They should not silently clamp or derive a replacement unless the canonical engine defines that behavior. Duplicate guard logic in a view can become a parallel rule even if it is intended as a defensive check.",
            "The publication boundary should preserve ordering where ordering encodes events, such as a timeline or decision list. Object key sorting in a canonical serializer is not permission to reorder arrays. Conversely, if an array is a set, its order may be irrelevant to the domain but still affect a digest. Define whether the order is semantic and normalize it only in the canonical model with a documented rule.",
            "When several desks respond to one input, their updates may not be atomic. A consumer might observe one new signal while another is still old. If a derived reading needs a consistent snapshot, the engine should define a revision or transaction boundary. Tests should verify that UI subscribers do not present mixed generations as a single coherent assessment.",
            "The signal contract should also document whether a desk has been worked. In custom missions, a starting value is not evidence until the operator engages the desk. A consumer that reads a default without checking publication status risks presenting simulated or placeholder data as a real assessment. Track readiness as a separate explicit state rather than infer it solely from whether a numeric field happens to exist.",
          ],
        },
      ],
      statutoryRule: "Rule 3.1-C: Every operational reading is computed exactly once by its designated desk and consumed everywhere else via the signal bus. A component that re-implements formula logic constitutes an unlawful parallel store.",
    },
    {
      heading: "IV. Defensive Isolation, Numeric Guards, and Runtime Integrity",
      subheading: "Sanitizing Floating-Point Anomalies and Defending the Analytical Pipeline",
      paragraphs: [
        "In a software environment dedicated to sovereign statecraft, computational integrity requires robust defence against corrupted, malicious, or non-finite inputs. In complex multi-party negotiations, field analysts operating under acute fatigue or hostile conditions may enter incomplete data, malformed numerical strings, or out-of-bounds metrics. If an analytical application accepts non-finite values such as NaN (Not-a-Number) or positive or negative infinity, the corruption cascades through downstream equations, resulting in frozen user interfaces, division-by-zero crashes, or manufactured stability indicators.",
        "To prevent numerical corruption from penetrating the MissionEngine signal bus, the UDCA implements a comprehensive suite of canonical input guards at the perimeter of the calculation pipeline (src/components/desk/mathGuards.ts). These mathematical guards sanitize every raw input before it reaches a formula. If an analyst enters a non-finite or undefined value for a relational bond, the guard automatically clamps the input to the baseline viable floor of 1.0. If an operator submits a corrupted load, exposure, or penalty metric, the guard intercepts the anomaly and returns a safe mathematical zero.",
        "Crucially, numeric input guards are designed to preserve conservative failure modes. A guard never manufactures false health or masks an authentic crisis. By defaulting corrupted bond scores to 1.0 (the minimum failing band), the system ensures that incomplete telemetry alerts the analytical team to an urgent intelligence deficit rather than generating an unearned green viability indicator. In sovereign diplomacy, false confidence is immeasurably more lethal than acknowledged uncertainty.",
        "Text fields also have a defined sanitization path: paste and blur handling applies Unicode NFC rather than NFKC, and the field sanitizer removes selected unwanted characters. This can preserve canonically equivalent language more faithfully than compatibility normalization, but it does not guarantee legal fidelity or neutralize every script-injection or prompt-injection risk. Review the exact sanitizer, rendering sinks, CSP, and content policy for the deployed version; NFC is not a security substitute for context-aware output handling.",
        "Numeric guards and a shared local signal path can reduce particular computational and data-flow risks, but they do not establish an unassailable security boundary. The browser may persist selected workspace data, the host and extensions remain in scope, and guards do not validate evidence quality. A defensible assurance statement should name tested controls and residual risks rather than promise absolute protection from cloud surveillance or mathematical corruption.",
      ],
      subsections: [
        {
          title: "The Mathematical Guardrails of mathGuards.ts",
          paragraphs: [
            "The numeric guard functions apply the documented boundary behavior before their associated canonical formulas. The relational bond guard enforces the boundary constraints \\(1.0 \\le B_{i} \\le 5.0\\). If an entered score falls below 1.0, it is clamped to 1.0; if it exceeds 5.0, it is clamped to 5.0. If the score is non-numeric or non-finite, it defaults to 1.0.",
            "For aggregate stress metrics, including the Inscribed Rupture Load and Compound Stress Multipliers, the guards ensure that all inputs satisfy \\(L \\ge 0\\). Negative values, which could mathematically reduce perceived tension without empirical justification, are barred from entry. The guards also freeze canonical mathematical constants, including the seven international forum fitness baselines, historical precedent coordinates, and the half-life decay coefficients, preventing accidental or malicious runtime mutation.",
            "These guard behaviors constrain specified inputs at the calculation boundary. They do not prove that a formula is appropriate, that its source evidence is accurate, or that a digest is complete and independently verifiable. Reviewers should inspect the canonical function, test the guard cases, and verify any seal through the documented serialization and hash procedure.",
          ],
          callout: {
            kind: "proof",
            title: "Mathematical Guard Invariant",
            paragraphs: [
              "For any raw input score \\(x\\), including undefined or non-finite inputs such as NaN or \\(\\pm \\infty\\), the guarded bond function \\(G(x)\\) satisfies: \\(G(x) = \\text{clamp}(\\text{finite}(x, 1.0), 1.0, 5.0)\\). This guarantees that the input domain of all downstream functions remains strictly compact and bounded within the statutory domain from 1.0 to 5.0.",
            ],
          },
        },
        {
          title: "Non-Finite Inputs, Missing Evidence, and Conservative Defaults",
          paragraphs: [
            "A numeric guard defines how a formula receives values; it cannot tell the analyst whether the source observation is true. In this application the canonical guard conventions are intentionally explicit: a non-finite bond reads at the 1.0 baseline, while a non-finite load, exposure, or penalty reads as 0. Those choices protect arithmetic from NaN and Infinity reaching the bus, but the result must not be interpreted as measured evidence. A baseline is a computational fallback, not an inferred observation.",
            "There is a subtle distinction between missing, malformed, and adverse data. A missing field may mean no assessment occurred; a malformed value may mean parsing or entry failed; an adverse observation may be a valid low score. Mapping all three to a number can conceal the reason for uncertainty. The interface and audit record should preserve a clear indication of what was supplied and what guard action was applied, where the design supports it, so a downstream reader does not mistake a fallback for field evidence.",
            "Numeric domains also need semantic definitions. A score bounded from 1.0 to 5.0 may be ordinal rather than interval-scaled. Computing its mean or variance presumes that differences between adjacent points can be treated numerically in a particular way. That may be a useful operational convention, but the curriculum should disclose the assumption and caution against importing stronger statistical claims than the measurement design warrants.",
            "Boundary analysis should cover finite values just below and above the allowed range, negative zero, very large magnitudes, decimal rounding, string inputs, nulls, missing keys, and arrays with unexpected length. The code's guards define some of these cases; unit tests should establish the rest. Do not silently add a new fallback, threshold, or normalization rule in a view. Any policy change belongs in the canonical math layer and must be reviewed against existing proofs and exports.",
          ],
        },
        {
          title: "Unicode Hygiene and the Integrity of the Received Record",
          paragraphs: [
            "Text normalization is a data-quality decision with legal and cryptographic consequences. Canonically equivalent Unicode strings can use different code-point sequences; NFC can make many such sequences consistent while preserving compatibility distinctions that NFKC may erase. A legal name, transliteration, or quoted source should not be transformed casually. In this application free text is sanitized on paste and blur, uses NFC rather than NFKC, and is not rewritten on every keystroke. That is a carefully bounded input policy, not a warrant to normalize the sealed record later.",
            "The verifier's job differs from the editor's job. Input handling can explain and sanitize selected content before acceptance; a verifier should report hidden or suspicious characters while hashing the record as received. If verification silently strips characters, changes line endings, or normalizes text, a modified record might hash as though it were unchanged. Explain both the stored representation and the display representation, especially when bidirectional controls or visually confusable characters could change how a reader sees a clause.",
            "Sanitization is not equivalent to security against prompt injection or executable markup in every context. Escaping, validation, safe rendering, policy enforcement, and user judgment address different threats. A string that is safe as text in a React text node may not be safe when used as a URL, HTML fragment, CSS value, or command argument. The exact output context determines the appropriate handling. Sanitization should not be advertised as a universal filter.",
            "A useful audit record states which transformation was applied, when, and to which input, without retaining unnecessary copies of sensitive raw text. If a transcription is materially altered by a safety filter, the operator may need to review the resulting text before relying on it. The system should preserve the original source through an authorized, separately protected evidentiary process if legal or diplomatic policy requires that custody; an ordinary UI field is not a complete archival system.",
          ],
        },
        {
          title: "Error Handling, Accessibility, and Human Review",
          paragraphs: [
            "A defensive pipeline needs defined behavior when a guard rejects input or a calculation fails. A blank panel, a zero reading, and a red error badge communicate different meanings. Avoid turning a failed computation into an apparently valid baseline without marking it as such. Logs may aid diagnosis but can themselves become sensitive data repositories; keep their content minimal, access controlled, and subject to retention policy.",
            "Accessibility is a reliability control. A color-only status may be invisible to some operators, and a transient alert may disappear before an interpreter or second reviewer reads it. Pair color with text and programmatic semantics; ensure keyboard access, screen-reader announcements, adequate contrast, and a method to revisit recent alerts. These practices improve the ability of every authorized operator to notice a changed or missing reading.",
            "A second reviewer should be able to trace a formula result without independently recreating the formula in the interface. Provide the inputs, the canonical formula identity, units, guards applied, and a readable derivation where appropriate. This is especially important when the value feeds an operational threshold. A proof display is a transparency feature, not an independent audit unless the reviewer can compare it against the implementation or another trusted reference.",
            "When evidence is disputed, preserve the distinction between computational correctness and epistemic quality. The engine can correctly average four entered numbers even if the source notes are stale, the scoring rubric is culturally biased, or the sample omits an affected community. Decision governance should identify who validates inputs, who can amend them, how disagreement is recorded, and when a quantitative result is too uncertain to drive action.",
          ],
        },
        {
          title: "A Reproducible Review Protocol for a Signal",
          paragraphs: [
            "A reviewer can use a compact protocol. First, identify the signal name and its domain definition. Second, locate the authoritative desk and the function that computes it. Third, inspect the guard behavior for missing and non-finite inputs. Fourth, compare the code's thresholds with the displayed label. Fifth, follow the publication and confirm that all consumers read the same value. Sixth, inspect whether the record identifies the observation date, analyst, and supporting evidence. This sequence tests both computation and meaning.",
            "For a selected test vector, document the raw input, each normalization or guard action, canonical calculation, bus publication, and final presentation. Store expected outcomes as fixtures where permissible, and include a deliberate invalid input to establish the fail-safe path. Use independent calculation only as an audit aid; do not make that second calculation a competing production source of truth. Where floating-point representation affects results, compare at the precision the engine specifies rather than using an unexplained tolerance.",
            "Reviewers should include negative cases. Can a desk publish before the operator works it? Can a stale value remain after an explicit clear? Can an array reorder silently change a chronology? Can a fast series of edits publish an older result last? Can the view label a missing value as zero? Can a browser error leave a green readiness indicator on screen? Each question should map to a test or a documented reason it is outside scope.",
            "The resulting review report should distinguish facts observed in code, test evidence, policy assumptions, and external threats. For example, 'the component calls the bus publisher after input change' is a code fact; 'no outbound transmission occurred in the tested workflow' is a bounded test result; 'the device is isolated from host malware' is a deployment assumption unless separately demonstrated. This vocabulary prevents a sound local design from being overstated as a complete security guarantee.",
          ],
        },
        {
          title: "Risk Assessment of Numeric Fallbacks",
          paragraphs: [
            "Numeric defaults have policy consequences. Returning a low bond baseline for a non-finite value prevents NaN from propagating and avoids an unearned viability score, but it may also make missing evidence appear like a measured failing relationship. Returning zero for a non-finite load avoids a computational exception but might conceal an unknown high load if the view displays it as observed zero. The guard behavior is fixed by the engine; interpretation and presentation should disclose that a fallback occurred.",
            "A robust interface separates a value from its quality state. A field can carry a numeric result plus status such as observed, estimated, missing, stale, or invalid. If the schema cannot carry those dimensions, an adjacent provenance record should explain them. Do not overload a numeric code to represent both a real measurement and the absence of one unless the formula and all consumers explicitly define that meaning.",
            "Guard tests should check both output and explanation. A test that confirms NaN becomes 1.0 demonstrates arithmetic safety; it does not show that the user understands the fallback. The UI should make the source invalidity visible and allow correction without losing the audit context. Exports should likewise identify guard actions when that information is needed for review.",
            "Avoid confusing bounds with validation. Clamping a finite value to the allowed range prevents out-of-range numbers from entering a formula, but it can hide a unit error or a maliciously extreme input. Whether a value should be rejected or clamped depends on the field's semantics. The canonical math layer governs the current rule; a future policy change requires an explicit migration, updated tests, and review of all formulas and proofs.",
            "Sensitivity analysis can reveal whether uncertainty matters. Recompute the decision under plausible inputs using the canonical calculation in a controlled analysis, and report how the conclusion changes. Do not expose a second production formula in the view. If the result is highly sensitive to an uncertain input, the appropriate operational conclusion may be to obtain better evidence rather than to report a precise point estimate.",
            "Aggregate scores require special care because a finite mean can hide a severe weak point. The curriculum's limiting-factor and dispersion measures may expose different characteristics, but each is a model output, not a complete account of a relationship. Analysts should communicate the components, assumptions, and limitations alongside the aggregate, and decision-makers should avoid treating a single threshold as an automatic policy directive.",
          ],
        },
        {
          title: "Numeric Safety Is Not Evidence Validation",
          paragraphs: [
            "A numeric guard answers a narrow engineering question: can a value with this representation enter a formula without violating the function's expected domain? It does not answer whether the value is measured, whether the source is authoritative, or whether the chosen scale describes the policy concept well. This distinction is essential when a guard converts an invalid number to a finite baseline. The output may now be computationally usable while remaining epistemically unresolved.",
            "A well-designed workflow records the reason for the fallback without changing the canonical formula. The interface can identify that an input was invalid, retain the original value only where safe and appropriate, and require correction or an explicit operator disposition. If data minimization prohibits keeping the raw malformed input, preserve a non-sensitive status code and provenance note. The goal is to prevent a downstream reader from confusing a safety default with a field observation.",
            "The same care applies to finite values that are technically in range. A bond score of 4.0 can be stale, derived from a source that does not support the asserted relationship, or entered under the wrong mission phase. Schema validation cannot establish those facts. The analyst's confidence and source quality should remain visible through separate fields or an authorized associated record rather than being inferred from a green numeric display.",
            "When the canonical math layer fixes a fallback policy, developers should not locally override it in a chart to make the view appear more intuitive. Instead, explain the policy at the input boundary and show status alongside the resulting value. If stakeholders conclude that a particular default is misleading, propose a reviewed change to the canonical guard, document its effect on every dependent formula, and update proofs, tests, and training together.",
            "This separation supports a defensible decision record. State what the engine calculated, what inputs were considered valid, what source evidence supports those inputs, and who accepted any remaining uncertainty. A finite result is a statement about successful computation; it is not a warrant to treat the proposition as true. Technical rigor improves diplomacy only when its limits are communicated as carefully as its outputs.",
          ],
        },
        {
          title: "Browser Runtime Boundaries and Locality Claims",
          paragraphs: [
            "The phrase browser-local describes where a selected code path executes, not the complete security boundary of the workstation. A web page receives capabilities from the browser, including access to network APIs, document storage, rendering, and user-mediated clipboard operations. Browser same-origin policy and process isolation can limit some interactions, but neither means a page is a physically separate machine or that every script running in the origin is trustworthy.",
            "A meaningful locality assessment begins with a defined data-flow question: do the desk inputs and computed signals leave the device during the tested workflow? Static inspection can identify fetch calls, analytics libraries, service-worker behavior, and dependency code; runtime observation can reveal actual destinations and payloads under selected scenarios. Neither method alone proves the absence of all transmission in every future execution, particularly when remote code, browser extensions, or environment-specific branches are involved.",
            "The loaded bundle matters as much as the source tree. A build may include dependencies, environment-specific configuration, or code injected by a hosting platform. Record the release artifact, its provenance, and its content security policy. If the deployment relies on a managed identity service or remote asset host, name those dependencies even if analytical payloads remain on the device. Precise boundaries are more credible than the blanket statement 'zero cloud.'",
            "Local storage also requires careful description. Browser storage may persist beyond the current component or page lifetime, and local data can be synchronized, backed up, copied, or inspected by a user with sufficient endpoint access. An application can encrypt a stored workspace, but then key derivation, unlock secrets, key lifetime, recovery, and device compromise become part of the threat model. Keeping data local reduces selected remote custody; it does not eliminate custody questions.",
            "An offline package can reduce dependence on remote services if all required code, fonts, identity assumptions, and assets are available locally. It introduces other duties: authenticate the package, control removable-media transfer, verify the release, and patch vulnerabilities. A network-denial exercise should test actual workflows on the target browser and device, not merely load the home page after disconnecting Wi-Fi. Document what could not be tested and which features degrade gracefully.",
          ],
        },
        {
          title: "Human Factors, Accessibility, and Error Legibility",
          paragraphs: [
            "Operational users do not interact with an abstract signal graph; they encounter labels, controls, focus order, warnings, and time pressure. A secure architecture can still produce unsafe decisions if a field's unit is hidden, an invalid value looks normal, a critical warning is conveyed only by color, or keyboard-only users cannot reach the correction path. Accessibility is therefore part of integrity: it helps ensure that the operator perceives the same state the engine has computed.",
            "An interface should make state transitions legible. If a custom-mission desk has not been worked, say that it is unassessed rather than displaying a plausible starter value as though it were a current finding. If a publication is explicitly cleared, distinguish that from an unavailable signal and from a measured zero. When an asynchronous update is pending, preserve an indication of the previous revision and avoid implying that it already includes the latest edit.",
            "Error handling should not silently repair a value in a way that changes its meaning. If a user enters an invalid number, give a specific explanation, retain focus predictably, and support correction without destructive loss of narrative context. If the canonical guard must apply a fallback for safety, expose that fallback as a status. Avoid modal overload during a stressful workflow, but do not hide a material condition in a transient toast that disappears before review.",
            "The privacy mask creates another interaction requirement. Narrative fields and content selectors may freeze while navigation selectors remain usable; labels and option text must be masked consistently with the intended policy. Screen readers, browser autofill, keyboard navigation, and assistive technologies should be tested because text-layer visual masking alone does not establish that content is inaccessible to every presentation layer.",
            "Human-factors validation should include operators with different roles, language backgrounds, and accessibility needs. Use realistic but synthetic scenarios and ask participants to identify whether a reading is assessed, stale, invalid, or cleared. Record where they hesitate or misinterpret a status. A field test is not a substitute for usability research, but it can reveal whether technically accurate data is being communicated in a way that supports safe, reviewable action.",
          ],
        },
        {
          title: "Independent Verification and Release Evidence",
          paragraphs: [
            "A strong review package lets another analyst reproduce bounded claims. Record the repository revision, build configuration, dependency lockfile, browser version, operating system, and test procedure. For locality claims, preserve network-capture findings with the workflow steps and known exclusions. For a signal claim, include synthetic inputs, guard outcomes, canonical function identity, publication key, and consumer result. This evidence should be protected from alteration according to the organization's recordkeeping policy.",
            "Independent verification does not require adding a second production formula. A reviewer can inspect the canonical implementation and compare a selected result with a hand calculation or a separate test harness. The separate check is an audit method; the live user interface should continue to read the canonical signal. Keep the two roles distinct so that the verification tool does not silently become a competing source of operational truth.",
            "A release should be tested against both expected and hostile conditions. Include malformed numeric input, explicit clearing, rapid repeated edits, interrupted storage writes, stale asynchronous completion, unavailable network services, and browser restart. Verify that errors are visible, that no old reading is misrepresented as new, and that recovery instructions are usable. The system should fail intelligibly even when it cannot guarantee uninterrupted operation.",
            "Tests are evidence with a scope. A unit test supports a claim about a function under tested inputs; a browser test supports a claim about a scenario in a selected runtime; a network capture supports a claim about observed requests during a bounded workflow. None establishes that no adversary can compromise a device or that every version behaves the same. A report should list uncertainty rather than let the presence of a green test badge imply universal assurance.",
            "Finally, establish change control for formulas and data contracts. A modification to a threshold, guard, signal name, or persistence layer can affect downstream desks and historical interpretation. Reviewers should identify affected consumers, update migration and regression tests, preserve release notes, and determine whether prior records need a version marker. Change control turns a shared bus from an informal convention into an auditable engineering interface.",
          ],
        },
        {
          title: "Assumption Ledgers and Bounded Assurance",
          paragraphs: [
            "An assurance review is stronger when it makes its assumptions inspectable. For each claim, record the system boundary, attacker capability, evidence source, test conditions, remaining uncertainty, and accountable owner. A statement such as 'desk calculations stay local' should specify which signals, application version, workflow, and network destinations were considered. Without a boundary, readers may mistakenly interpret a narrow code observation as a guarantee about the entire device or deployment.",
            "Assumptions should be revisited when the environment changes. A new analytics dependency, identity provider, browser extension policy, workspace persistence option, or service-worker update can alter the data-flow boundary. The release process should compare material changes against the prior threat model, not only against the user-interface feature list. If the team cannot verify a new dependency's behavior, it should say so and decide whether to block, isolate, or accept the uncertainty.",
            "Separate direct evidence from inference. Source code can show that a desk calls a particular publisher; a test can show a particular value reached a consumer; a network capture can show requests in one tested session. From these facts, a reviewer may infer that the tested path behaves as designed. None of them alone proves that a malicious administrator, browser extension, compromised operating system, or future code update cannot access data.",
            "Confidence should be attached to a proposition rather than to the system as a whole. A team may have high confidence in its numeric guard tests, moderate confidence in the completeness of its network inventory, and low confidence in resistance to a privileged host attacker. This calibrated account helps decision-makers select suitable use cases instead of forcing a binary 'secure/insecure' label onto a complex system.",
            "Residual risk must have an owner and treatment. The report can recommend reducing the data entered, using a managed device, disabling unsupported extensions, obtaining an offline release, or applying a formal records process. If risk is accepted, document who accepted it, for which mission, for what period, and under what review trigger. An unresolved risk should not disappear because an architectural diagram appears clean.",
            "The same ledger supports later incident analysis. When a control fails, reviewers can compare the actual event with what was assumed, what was tested, and what was explicitly excluded. This makes the failure a source of learning rather than an argument over whether the original design was 'air-gapped' or 'tamper-proof.' A precise assurance record improves future decisions even when it cannot guarantee a perfect outcome.",
          ],
        },
        {
          title: "Operational Handover and Reproducible State",
          paragraphs: [
            "A browser workspace can be shared by handing over a device, exporting a record, or asking another operator to reconstruct the state. Each method changes the trust boundary. A live session may expose in-memory content to the next user; an export may omit transient signals or provenance; a manual reconstruction can introduce transcription errors. Define the handover artifact and the information that must accompany it before relying on continuity between operators.",
            "The receiving operator should verify the application version, mission identity, current desk engagement state, source dates, and unresolved warnings. A bus value alone may not carry enough context to explain how it was assessed. If a browser-local workspace is saved, confirm that the relevant payload and schema version were actually persisted, that the latest revision completed, and that recovery did not mix records from different times.",
            "A handover checklist should identify which values are assessed, unassessed, cleared, stale, estimated, or invalid. It should include the responsible analyst and review status where policy permits. Avoid a free-form checklist that merely repeats numeric values without explaining their provenance. The successor must be able to determine which questions require new evidence and which results may safely be carried forward.",
            "The final review should distinguish operational continuity from legal custody. A copied workspace can help the next analyst resume work, but it does not automatically create an official archive or authenticate the author's identity. If the record is to be relied upon outside the browser session, use the institution's approved signature, records, and chain-of-custody process. The software can support that process only to the extent its fields and behavior actually implement it.",
          ],
        },
        {
          title: "Reading a Locality Claim Against Its Evidence",
          paragraphs: [
            "When a report says that processing is local, ask which data is covered, which workflow was tested, and what the observation method could detect. Inspect source and built code, review dependencies, and capture network behavior during the complete scenario. Record authentication, asset delivery, telemetry, and error reporting separately so that the claim neither ignores real remote services nor implies that every request carries analytical content.",
            "A reproducible report should include release identity, device and browser configuration, steps, observed destinations, excluded cases, and test limitations. Another reviewer should be able to repeat the workflow with synthetic data. If a capture does not show a request, state that it was not observed in the test rather than claiming that no future or conditional path can transmit it.",
            "Code locality, endpoint trust, and legal custody are different propositions. A local formula can reduce one disclosure path while the device remains exposed to privileged software. A secure endpoint can still use a provider whose jurisdiction matters. Counsel, security engineers, and operators should each review the part of the assurance claim within their expertise and identify unresolved assumptions.",
            "This evidence discipline makes an architecture decision actionable. A deployment may be approved for a particular data classification with a managed endpoint and approved network services, while higher-sensitivity records require an offline package or another process. Scope, conditions, and review dates should accompany the decision so that local computation is treated as one control, not a blanket exemption from security governance.",
          ],
        },
      ],
      statutoryRule: "Rule 3.1-D: All formula inputs must pass through canonical numeric guards. A non-finite bond defaults to the 1.0 baseline, and non-finite stress metrics default to zero. No NaN or Infinity may enter the MissionEngine signal bus.",
    },
  ],
  practice: [
    {
      problem: "An operational field team enters a raw relational bond vector of (4.2, NaN, 3.6, -0.5) alongside an unverified inscribed rupture load of Infinity. Explain how the canonical numeric guards in mathGuards.ts sanitize these inputs, calculate the resulting four-bond state vector, compute the arithmetic mean and Liebig limiting bond, and trace how these sanitized values propagate across the MissionEngine signal bus to Desk 02 without triggering downstream computational failure.",
      solution: [
        "1. Sanitization of Relational Bonds: The canonical guard evaluates each bond coordinate sequentially against the statutory domain from 1.0 to 5.0. The first coordinate (4.2) is finite and within bounds, so it is preserved: \\(B_{\\text{interpersonal}} = 4.2\\). The second coordinate is NaN (Not-a-Number); the guard intercepts this non-finite anomaly and defaults it to the baseline failing score: \\(B_{\\text{communal}} = 1.0\\). The third coordinate (3.6) is valid and preserved: \\(B_{\\text{intergenerational}} = 3.6\\). The fourth coordinate is negative (-0.5); the guard clamps it to the minimum statutory boundary: \\(B_{\\text{institutional}} = 1.0\\).",
        "2. Sanitized State Vector: The resulting sanitized four-bond state vector on Desk 01 is \\(B = (4.2, 1.0, 3.6, 1.0)\\).",
        "3. Calculation of Arithmetic Mean: The desk computes the arithmetic mean from the sanitized coordinates: \\(\\mu_{B} = \\frac{4.2 + 1.0 + 3.6 + 1.0}{4} = \\frac{9.8}{4} = 2.45\\).",
        "4. Calculation of the Liebig Limiting Bond: Applying the Justus von Liebig Law of the Relational Minimum yields \\(B_{\\min} = \\min(4.2, 1.0, 3.6, 1.0) = 1.0\\).",
        "5. Sanitization of Inscribed Rupture Load: The unverified rupture load of Infinity is evaluated by the stress guard. Because Infinity is non-finite, the guard intercepts the value and normalizes it to zero: \\(L = 0\\).",
        "6. Propagation to the MissionEngine Signal Bus: Desk 01 packages the sanitized vector, mean (2.45), variance, and Liebig minimum (1.0) into a desk publication and sends it to the signal bus. A publication is an application state update, not proof that the underlying observations are true or that the object is immutable against every runtime actor.",
        "7. Ingestion by Desk 02 (The Eye of Humanity): Desk 02 consumes the published values from the bus. Because \\(B_{\\min} = 1.0\\) sits in the Failing band from 1.0 to 2.0, Desk 02 immediately trips Stage Gate 1 (Vector Integrity) as LOCKED. The application processes the entire calculation without throwing runtime exceptions, proving that numeric guards defend downstream instruments against catastrophic failure.",
      ],
    },
    {
      problem: "A ministry wants to describe a browser deployment as an 'air-gapped, zero-cloud, tamper-proof diplomatic environment.' The tested workflow loads the site from a managed static host, performs authentication through a separate identity service, computes desk readings in the MissionEngine, stores a workspace in a configured browser-local destination, and exports a PDF. Write an assurance review that separates code facts, deployment facts, policy requirements, and unverified assumptions. Identify what evidence would be required before making any of the three claims, and recommend narrower language if the evidence is incomplete.",
      solution: [
        "Begin by decomposing the phrase into independent assertions. 'Air-gapped' describes physical and logical connectivity, so the static host and identity service already show that the tested path is not a fully disconnected deployment. 'Zero-cloud' might mean only that selected analytical payloads are not sent to a remote calculation service, or it might mean no remote processing or persistence at all; the ministry must define the boundary. 'Tamper-proof' is too broad unless the threat model, protected assets, reference custody, and attacker capabilities are stated.",
        "The code fact is that the MissionEngine exposes local publish/read behavior for desk calculations and that workspace persistence has configured local or encrypted-vault paths. The implementation fact alone does not establish that authentication, static asset delivery, browser telemetry, error reporting, identity claims, or PDF output never communicate remotely. The test should capture network activity for the full login, assessment, save, reopen, export, error, and logout workflows using the exact production build and supported browsers.",
        "To assess air-gap status, inventory device interfaces, network policy, removable media, update channels, and peripherals. A static copy can be made available offline, but its provenance and update path remain relevant. To assess tamper evidence, identify whether an independent signature, protected baseline, or external witness exists; local state and a local digest can be modified by a sufficiently privileged adversary. A documented test should distinguish accidental UI changes from malicious host-level modification.",
        "A defensible statement might say: 'Desk calculations are performed in the browser-side MissionEngine; the tested release did not transmit desk signal payloads in the listed assessment workflow. Authentication and asset delivery use specified remote services. The assessment does not establish endpoint immunity or forensic erasure.' If offline use is required, test a separately packaged release without connectivity and record how updates and authentication work. The assurance report should include release hash, test date, coverage, exceptions, and the accountable risk owner.",
      ],
    },
    {
      problem: "A custom mission starts with no publications from several untouched desks. After the operator edits Desk A, the readiness view updates; a separate chart proposes a locally calculated substitute for a missing Desk B value so that the chart can always render. Explain which elements of this sequence are consistent with the MissionEngine design, why the chart's fallback is problematic, and how the team should distinguish 'not assessed,' 'cleared,' and 'zero' without inventing a formula or publication.",
      solution: [
        "The custom mission rule distinguishes initial defaults from work performed by an operator: a desk's publications are dropped until that desk is first worked, with narrowly defined shell publishers exempt. Desk A's user interaction can therefore authorize its own publication and cause a downstream readiness view to reflect the bus state. This is a semantic guard against treating starter values as evidence, not a claim that every blank signal means the same thing.",
        "The chart's substitute value creates a second state interpretation. If it computes a proxy from Desk A or treats missing Desk B as zero, it has introduced view-layer mathematics that is not defined by the canonical desk function. The chart can now disagree with the engine, and a user may believe the result came from Desk B when it did not. A loading placeholder or explicit unavailable label is safer than an invented analytical value.",
        "The schema should state whether an explicit undefined publication clears a previously held signal, whether absence means no publication has ever occurred, and whether numeric zero is a valid observation in that domain. Those are different states. A consumer should preserve that distinction rather than use truthiness checks that collapse zero with missing data. If a valid zero is meaningful, the user interface should render it as a value; if no reading exists, it should say not assessed or cleared according to the engine contract.",
        "Testing should cover an untouched desk, a desk worked once, an explicit clear, a valid zero, a page reload or mode transition, and a consumer view receiving each case. Assert that only the canonical publisher writes the value and that the readiness view reads it. If policy requires an aggregate when a component is missing, define that aggregation in the canonical engine and disclose its assumptions; do not smuggle it into a chart merely to avoid empty space.",
      ],
    },
    {
      problem: "A reviewer sees a single published state vector and concludes that all downstream views are therefore correct and that the record is immutable. Develop a counter-review using the distinctions among determinism, consistency, provenance, and immutability. Propose a test plan that checks the reading from input through publication without adding a parallel production formula.",
      solution: [
        "A single bus can reduce conflicting representations, but it does not prove that the input was accurate, that the formula is appropriate, that the publisher used the latest input, or that every consumer renders the correct field. Determinism means defined inputs and code yield a repeatable result under stated conditions. Consistency means consumers share a representation. Provenance identifies where the input came from and who reviewed it. Immutability concerns resistance to subsequent change. These properties are related but not interchangeable.",
        "The reviewer should trace one measurement through the interface sanitizer, canonical desk function, publication key, engine state update, and subscribing view. Compare the view's displayed unit, label, and threshold with the canonical definition. Check for copied local state that can become stale, view-layer formula duplication, silent coercion of missing values, or asynchronous callbacks that can overwrite a newer publication. The reviewer can calculate an expected result offline for audit but should not add that calculation to the production chart.",
        "Build tests for valid boundary values, non-finite fallback, explicit undefined clears, array ordering, rapid successive edits, remounting, and a consumer that subscribes before and after the publication. Verify that a stale asynchronous completion cannot replace a newer revision. A property-based test can generate valid input tuples and assert domain constraints; regression fixtures can cover known cases. Cross-browser tests should check the supported runtime assumptions rather than presume universal bit identity.",
        "Finally, examine provenance and change control. Does the signal include the source date, assessment phase, operator, confidence, or formula version needed to interpret it? If not, is that information held in an associated record? Can a user or extension alter browser state after publication? Is a seal or independent audit available? The correct conclusion may be that the signal is a consistent operational reading under the current application state, not immutable evidence or a complete factual account.",
      ],
    },
    {
      problem: "Design a release and recovery plan for a delegation that needs to run the analytical workspace during a planned network-denial exercise and later update it from controlled removable media. The plan must address code provenance, offline feature testing, update security, data recovery, and failure handling without claiming that browser-local execution alone creates an air gap.",
      solution: [
        "First define the offline scope and prepare a release artifact from a reviewed commit using a controlled build environment. Record the source revision, dependency lock state, build tool versions, artifact checksum, and release approver. Where feasible, produce reproducible builds or independently compare the artifact to a signed release manifest. Include the exact runtime requirements and a software bill of materials so reviewers can assess bundled dependencies.",
        "Test the packaged application on a clean, managed device with network interfaces disabled according to the exercise plan. Exercise authentication or the approved offline sign-in path, each required desk, local or enclave save, reload, handover digest, PDF export, clipboard use, timeout lock, and panic cleanup. Capture failures and browser console errors. Confirm that no workflow silently waits for a remote asset, identity endpoint, font, or telemetry service. A rendered landing page is not enough.",
        "For updates, define an authenticated transfer process: an authorized source prepares the package, an independent recipient verifies its signature or checksum over a separate trusted channel, malware scanning and approval occur before installation, and the old version can be restored if the update fails. Record who transported the media and when it was connected. Removable media is both an update route and a potential import/export channel, so the policy should control what mission data may be written to it.",
        "Recovery should specify which state is retained, whether it is encrypted, who holds the unlock secret, how a replacement device is provisioned, and how the team avoids restoring a compromised browser profile. Test restoration from a backup and document whether the seal remains valid under the restored build and schema. On failure, operators need a safe manual record process and an incident contact; never tell them to bypass a warning or assume that a panic purge erased all copies.",
      ],
    },
    {
      problem: "An analyst enters a valid-looking four-bond vector and an aggregate score, but source notes are stale, one value was inferred from a missing report, and the device clock is five hours wrong. Explain how numeric guards, signal provenance, timestamps, and human governance should interact so that a finite reading is not mistaken for verified evidence.",
      solution: [
        "The numeric guards can ensure that specified values are finite and bounded before canonical formulas receive them. They cannot establish that the source report existed, that the observation is current, or that an inferred score was authorized. The finite vector therefore proves only that the arithmetic has acceptable inputs under the application's guard conventions. It does not prove empirical validity or confidence.",
        "The missing report should remain explicitly missing rather than be replaced by a plausible score unless a documented method permits an estimate and labels it as such. Record source identity, source date, assessment date, author, confidence, and review status where policy allows. If the application does not currently model these fields, the operator should preserve them in an authorized binder note and the reviewer should avoid describing the reading as fully sourced.",
        "A device clock that is five hours wrong makes local event timestamps unreliable as independent time evidence. Displaying a UTC string generated from a local clock does not correct the source. The workflow should compare against an approved time source when available, record the uncertainty, or avoid claiming trusted timing. Do not silently adjust the analytical signal with an invented temporal correction unless the canonical formula specifies one.",
        "Human governance should decide whether the evidence is sufficient for the decision, who can approve an assumption, and how dissent is preserved. The MissionEngine can propagate a result consistently; it cannot arbitrate whether an input should have been entered. A responsible output labels the values as provisional, identifies missing evidence, and prevents an aggregate readiness result from concealing material uncertainty.",
      ],
    },
    {
      problem: "A release review observes that the MissionEngine makes no network request during one synthetic assessment, but login uses a remote identity service, the page loads static assets from a host, and the browser has an approved extension. Draft a bounded assurance statement and an evidence plan that separates application data-flow behavior from deployment and endpoint assumptions.",
      solution: [
        "State the observed proposition narrowly: in the tested release and synthetic assessment workflow, the selected desk inputs and computed readings were not observed in outbound requests to the tested destinations. Record the build hash, browser version, network capture method, user steps, and test date. Do not generalize this result to all application workflows, future releases, all network interfaces, or data held by the identity provider.",
        "Inventory the remote dependencies separately. Document the identity service's attributes and retention, the static asset host and delivery path, any service worker, error reporting, telemetry, and third-party libraries. Inspect the built artifact and dependency tree as well as source code, then perform runtime tests for login, assessment, save, reopen, export, failure, and logout. Include offline or network-denial tests if offline operation is a requirement.",
        "The approved extension is an endpoint assumption that must be evaluated by its publisher, permissions, update policy, and management configuration. A same-origin page cannot establish that the extension or operating system is trustworthy. Record the browser policy that permits it, assess whether it can read or alter page content, and test with the actual managed profile rather than assuming extension isolation guarantees no access.",
        "A suitable statement might say: 'Desk calculations execute in the browser-side MissionEngine. No desk-input payload transmission was observed during the defined synthetic assessment test. Authentication and static asset delivery use the listed remote services. The assessment does not establish that the endpoint, approved extensions, or host operating system are free of compromise.' Add known exclusions and the risk owner.",
        "The evidence plan should preserve the report, test fixtures, network capture, build provenance, and dependency inventory in an approved location. Repeat tests after changes to remote services, scripts, extensions, or browser policy. If the assurance is for a specific mission, classify the data, identify legal and operational constraints, and decide whether the residual endpoint and provider risks are acceptable before use.",
      ],
    },
    {
      problem: "A follow-on analyst opens a saved browser-local workspace and sees a current-looking aggregate readiness score, but the workspace contains no source dates and several desks have not been engaged in the current custom mission. Determine what can and cannot be inferred, and design a safe handover review before the score is used.",
      solution: [
        "The displayed aggregate proves only that the current application rendered a value from the state it had available. Without source dates, the analyst cannot establish freshness; without desk engagement, a custom mission may intentionally suppress publications from untouched desks so default values are not mistaken for assessment. A numeric aggregate should not be assumed to summarize a complete, current set of evidence.",
        "Inspect the mission mode, bus publication state, and each desk's engagement status. Identify which signals have a current operator publication, which are missing, explicitly cleared, or inherited from a prior saved state, and which are not applicable. Do not treat missing values as zero or infer that the aggregate filled them using a canonical method unless the engine contract says so.",
        "Review the workspace schema and saved revision, and confirm the application version that produced it. Determine whether the latest save completed before handover. If the record was restored from a backup, establish whether the profile, binder, signals, and decisions came from the same revision. Local timestamps are useful context but may reflect an inaccurate device clock.",
        "Ask the originating analyst to provide authorized source notes, observation dates, confidence, and review status. Where those cannot be recovered, record the gap rather than inventing provenance. If the relevant input must be refreshed, engage the responsible desk and use its canonical function and publication path; do not make a substitute calculation in the shell or a chart.",
        "Until the coverage and provenance are established, label the aggregate provisional or unavailable for the intended decision. Preserve the prior state and the review outcome according to records policy. A new reading should be attributed to the follow-on assessment rather than presented as though it had been present in the original workspace.",
      ],
    },
  ],
  readingList: [
    {
      citation: "United Nations. Vienna Convention on Diplomatic Relations (1961), Article 24.",
      url: "https://legal.un.org/ilc/texts/instruments/english/conventions/9_1_1961.pdf",
      note: "Primary treaty text on the inviolability of mission archives and documents; it does not specify a cloud-computing architecture.",
    },
    {
      citation: "United States Code, 18 U.S.C. § 2713, Required preservation and disclosure of communications and records.",
      url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section2713&num=0&edition=prelim",
      note: "Statutory text relevant to providers subject to United States jurisdiction; evaluate its scope and process rather than treating it as universal foreign access.",
    },
    {
      citation: "U.S. Department of Justice. CLOUD Act Resources.",
      url: "https://www.justice.gov/criminal/cloud-act-resources",
      note: "Official explanatory material on the CLOUD Act, executive agreements, and cross-border data access framework.",
    },
    {
      citation: "NIST. SP 800-207: Zero Trust Architecture (2020).",
      url: "https://doi.org/10.6028/NIST.SP.800-207",
      note: "Authoritative architecture guidance on resource-centered access decisions and trust assumptions; it is not a mandate for browser-only processing.",
    },
    {
      citation: "NIST. SP 800-218: Secure Software Development Framework (SSDF), Version 1.1.",
      url: "https://doi.org/10.6028/NIST.SP.800-218",
      note: "Practices for reducing software supply-chain risk and maintaining secure development and release processes.",
    },
    {
      citation: "WHATWG. HTML Standard, Web Storage.",
      url: "https://html.spec.whatwg.org/multipage/webstorage.html",
      note: "Normative reference for the page-session and origin-scoped storage APIs; useful for distinguishing storage lifetime from RAM.",
    },
    {
      citation: "W3C. Content Security Policy Level 3.",
      url: "https://www.w3.org/TR/CSP3/",
      note: "Web policy specification for restricting resource loading and script execution as a complementary control.",
    },
    {
      citation: "RFC 9116. A File Format to Aid in Security Vulnerability Disclosure.",
      url: "https://www.rfc-editor.org/rfc/rfc9116",
      note: "A model for publishing vulnerability-disclosure contact information and coordinating security reports.",
    },
    {
      citation: "Shannon, Claude E. (1948). A Mathematical Theory of Communication. Bell System Technical Journal, 27, 379–423, 623–656.",
      url: "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x",
      note: "Foundational information theory; useful background but not evidence for a specific browser threat claim.",
    },
    {
      citation: "Liebig, Justus von. (1843). Familiar Letters on Chemistry and Its Relation to Commerce, Physiology, and Agriculture.",
      url: "https://archive.org/details/familiarletters00lieb",
      note: "Historical source for the limiting-factor analogy; the analogy should not be mistaken for empirical validation of a policy score.",
    },
    {
      citation: "Vinculum Security Website source: src/components/desk/engine.ts.",
      note: "Primary implementation reference for the MissionEngine signals, canonical calculations, publish/read interfaces, and their actual client-side behavior; inspect the same release revision as the deployed application.",
    },
    {
      citation: "Vinculum Security Website source: src/components/desk/mathGuards.ts.",
      note: "Primary implementation reference for finite input fallbacks, frozen constants, and numeric guard behavior described in this chapter.",
    },
    {
      citation: "Vinculum Security Website source: src/components/mode/academyCurriculum.ts and src/components/mode/academyFormulas.ts.",
      note: "Curriculum source of truth for chapter content, canonical prose measurement, and formula metadata; compare its statements against the engine implementations.",
    },
  ],
  quiz: [
    {
      id: "q3-1-1",
      question: "What is the defensible security benefit of keeping designated desk calculations in the browser rather than sending each input to a remote calculation service?",
      options: [
        {
          id: "opt-a",
          text: "To minimize cloud hosting subscription fees for the analytical development team.",
          explanation: "Incorrect. The architectural mandate is dictated by sovereign security, not commercial hosting expense.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "To keep designated analytical calculations in the client-side application and reduce routine transmission of those inputs, while leaving deployment, host, and legal risks to be assessed separately.",
          explanation: "Correct. Browser-local computation can reduce a particular data path; it does not itself eliminate all networking, endpoint compromise, or legal questions.",
          correct: true,
        },
        {
          id: "opt-c",
          text: "Because client web browsers lack the networking APIs required to transmit HTTP POST payloads.",
          explanation: "Incorrect. Browsers natively possess extensive networking capabilities; the UDCA deliberately restricts outgoing traffic to preserve sovereign confidentiality.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "To optimize rendering speed for consumer smartphones on low-bandwidth satellite links.",
          explanation: "Incorrect. While offline performance is superior, the governing architectural rationale is counter-intelligence defence.",
          correct: false,
        },
      ],
    },
    {
      id: "q3-1-2",
      question: "Under the MissionEngine architecture, what occurs when an individual user interface view attempts to calculate and display an alternative Rupture Index independently of the signal bus?",
      options: [
        {
          id: "opt-a",
          text: "The action violates Rule 3.1-C by introducing an unauthorized parallel store that can desynchronize the presentation layer from canonical mathematical reality.",
          explanation: "Correct. All telemetry must be computed once by the designated desk and published to the bus. View-layer calculations create dangerous parallel stores.",
          correct: true,
        },
        {
          id: "opt-b",
          text: "The signal bus automatically merges the two calculations using a weighted linear regression model.",
          explanation: "Incorrect. The bus never merges conflicting view calculations; it strictly enforces single-point publication from authoritative desks.",
          correct: false,
        },
        {
          id: "opt-c",
          text: "The operation is encouraged because redundant view calculations provide Byzantine fault tolerance.",
          explanation: "Incorrect. Duplicating mathematical logic in the view layer creates out-of-order race conditions and false telemetry readings.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "The application exports the discrepancy to an external audit log for retrospective review.",
          explanation: "Incorrect. The system operates with zero external network persistence and prevents parallel stores by design.",
          correct: false,
        },
      ],
    },
    {
      id: "q3-1-3",
      question: "How do the canonical numeric input guards in mathGuards.ts respond when an operator inadvertently enters a non-finite value such as NaN or Infinity for a relational bond score?",
      options: [
        {
          id: "opt-a",
          text: "The guard throws an unhandled JavaScript exception, forcing the operator to reload the browser tab.",
          explanation: "Incorrect. The guards prevent application crashes by sanitizing malformed inputs deterministically before calculation.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "The guard clamps the non-finite input to the 1.0 failing baseline, ensuring conservative failure assessment without crashing downstream formulas.",
          explanation: "Correct. To preserve safety and prevent manufactured viability, non-finite bond values default to the 1.0 minimum failing score.",
          correct: true,
        },
        {
          id: "opt-c",
          text: "The guard interpolates an estimated score based on the arithmetic mean of the remaining three bonds.",
          explanation: "Incorrect. The system never fabricates synthetic data or guesses bond scores; missing data must trigger an explicit failing alert.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "The guard sets the bond score to 5.0 to allow the diplomatic negotiation to continue without interruption.",
          explanation: "Incorrect. Setting corrupted inputs to a fortified 5.0 score would introduce lethal false confidence into the diplomatic mission.",
          correct: false,
        },
      ],
    },
    {
      id: "q3-1-4",
      question: "Which review best tests whether a displayed mission reading follows the canonical signal path?",
      options: [
        {
          id: "opt-a",
          text: "Recreate the same formula inside the chart and compare the colors.",
          explanation: "Incorrect. A second production calculation creates a parallel source rather than testing the canonical path.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "Trace the input through its guard and canonical engine function, verify the publisher and bus value, then confirm consumers read rather than recompute it.",
          explanation: "Correct. This checks both formula ownership and propagation while preserving one authoritative calculation path.",
          correct: true,
        },
        {
          id: "opt-c",
          text: "Assume the value is correct because every desk uses the same bus.",
          explanation: "Incorrect. A shared channel improves consistency but cannot establish input accuracy or sound measurement assumptions.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "Treat browser-local execution as proof that no user, extension, or host process can access the data.",
          explanation: "Incorrect. Local execution narrows some data paths but does not establish endpoint trust or physical isolation.",
          correct: false,
        },
      ],
    },
  ],
};
