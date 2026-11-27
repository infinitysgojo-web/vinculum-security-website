import type { DetailedAcademyChapter } from "./academyTypes";
import { F_SEAL } from "./academyFormulas";

export const CHAPTER_3_2: DetailedAcademyChapter = {
  id: "anti-tamper-sealing",
  number: "3.2",
  eyebrow: "Module III · Chapter 3.2",
  title: "Canonical JSON Serialization, Tamper Evidence & Cryptographic Handover Sealing",
  estimatedMinutes: 80,
  executiveLede: "A cryptographic digest can make changes to a defined record detectable when the reference digest is independently protected and the bytes are prepared consistently. This chapter examines the UDCA handover payload, its recursive key ordering, browser Web Crypto SHA-256 operation, and local divergence display. It distinguishes this implementation's canonical JSON helper from IETF RFC 8785, and a hash from a digital signature, trusted timestamp, or legal ratification. A digest is not encryption, cannot establish factual truth, and provides no independent evidence if an adversary can replace both the record and its stored baseline.",
  synopsis: [
    "Historical negotiations illustrate how disputed drafts, translations, or side letters can create competing accounts of an agreement. Cryptographic integrity tools can help preserve one precisely defined digital record, but they cannot resolve semantic ambiguity in the record or prove that a party accepted its terms. A signed diplomatic instrument, its authentic copies, translations, and authoritative version clauses remain governed by applicable treaty practice and law.",
    "A hash operates on bytes, not on abstract objects. Different serializations of semantically similar JSON can produce different digests, so a system needs a defined serialization rule. JSON itself does not make every object representation canonical. RFC 8785 describes one specific JSON Canonicalization Scheme; the repository uses its own canonicalJson helper, whose behavior must be described as implemented rather than assumed to conform to that RFC.",
    "The local helper recursively sorts object keys, drops undefined object members and functions, maps those values to null inside arrays, writes non-finite numbers as null, preserves array order, and delegates final textual formatting to JSON.stringify. Text entry handling uses NFC at paste and blur in relevant fields; canonicalJson does not normalize strings at hash time. These choices define this application's bytes and are not identical to every canonical JSON standard.",
    "The handover digest is calculated with SHA-256 over UTF-8 text through Web Crypto. It is useful for comparing a payload with a trusted reference. A hash alone does not authenticate who created the reference, hide its contents, prove when it existed, or make a mutable local record immutable. Divergence review can compare stored canonical text with current canonical text, but the result is only as trustworthy as the storage, code, and custody assumptions around both.",
  ],
  statutoryNotice: "Internal UDCA convention—not a statute or treaty rule: the Handover Seal is a local comparison aid over a defined payload. It does not by itself establish independent custody, factual truth, signer authority, or treaty consent.",
  learningOutcomes: [
    "Analyze how version control and textual ambiguity differ from integrity failure, using documented records without inferring unsupported causes.",
    "Deconstruct the mathematical prerequisites of deterministic canonical JSON serialization across deeply nested state objects.",
    "Explain what a SHA-256 digest can and cannot establish, and distinguish hashing from encryption, signatures, timestamping, and treaty consent.",
    "Diagnose and resolve Divergence Beacon alerts by conducting parameter-level differential audits of modified mission telemetry.",
    "Distinguish the UDCA's internal digest convention from technical assurance, factual validation, and applicable treaty law.",
  ],
  sections: [
    {
      heading: "I. Diplomatic Records, Version Disputes, and Textual Interpretation",
      subheading: "Version control, documentary custody, and the limits of byte-level evidence",
      paragraphs: [
        "Diplomatic records can include negotiating drafts, exchanged notes, authenticated treaty texts, signed instruments, and internal memoranda. These categories have different legal status and custody requirements. A disagreement about which document is authoritative may arise from version control, translation, approval, or interpretation; it should not be described as falsification without evidence that a record was deliberately altered.",
        "Seals, signatures, registries, witnesses, and controlled archives have historically served different evidentiary functions. A physical seal may indicate whether a closure appears disturbed, but does not prove that the contents are authentic or that the text was accepted. Modern cryptographic digests likewise provide only a bounded check: they compare selected bytes to a trusted reference under a defined serialization and custody process.",
        "Digital records are editable, and privileged access can permit changes; neither property establishes that a particular record was altered. A reviewer should preserve the original artifact, identify the custody chain, examine version history and authorization, and distinguish a demonstrated change from a plausible risk. Logs may be incomplete or mutable, so their provenance also matters.",
        "A digest can reduce uncertainty about whether two parties are examining the same defined representation. It cannot resolve a dispute over meaning, authority, omitted annexes, or consent. A sound process combines controlled drafting and approvals with a clearly selected payload, independent reference custody, reproducible verification, and the legal procedures governing the instrument.",
      ],
      caseStudy: {
        title: "Source Analysis: RFC 8785 and the Limits of Canonicalization",
        jurisdiction: "Internet Engineering Task Force JSON Canonicalization Scheme",
        precedent: "RFC 8785 specifies a representation profile for constrained JSON data",
        analysis: [
          "RFC 8785 specifies the JSON Canonicalization Scheme for a constrained JSON data model. It defines details such as primitive serialization, property ordering, and string handling so independent implementations can derive a consistent representation. The RFC is the source for that scheme; it is not evidence that every JSON serializer or application-specific helper conforms to it.",
          "Canonicalization answers a representation question: which bytes should a conforming process produce from accepted data? It does not decide which fields are authoritative, whether an array is chronologically meaningful, whether a statement is accurate, or whether a party agreed to its contents. Those choices belong to the schema, provenance process, human review, and applicable law.",
          "The repository's canonicalJson helper recursively sorts object keys and then delegates text generation to JSON.stringify, but also transforms unsupported JavaScript values. As described in this chapter, functions and undefined array elements become null, while corresponding object properties are omitted; non-finite numbers become null; arrays preserve order. It is not claimed to implement the full RFC 8785 profile.",
          "A verifier should therefore use the application's documented payload and test vectors, not infer conformance from the phrase 'sorted keys.' If cross-language interoperability is required, either adopt a standards-conformant implementation for the accepted data model or publish and test a versioned application-specific profile.",
        ],
        failureMechanism: "Canonicalization standardizes a representation but does not validate semantic meaning, authorship, completeness, agreement, or legal effect.",
      },
      subsections: [
        {
          title: "Canonical Bytes Do Not Resolve Semantic Disagreement",
          paragraphs: [
          "A digest can help identify whether two parties are examining the same defined representation when they use the same schema and canonicalization procedure. It cannot determine whether a term is ambiguous, whether a translation captures the same meaning, or which document governs. A stable record can preserve a disagreement without resolving it.",
          "A hash comparison is also limited by the reference and the covered fields. If the parties select different attachments, omit a side letter, or store the only reference in a mutable browser profile, matching local values do not establish completeness or independent custody. Document selection and approval must precede sealing.",
          ],
          callout: {
            kind: "definition",
            title: "Cryptographic Tamper-Evidence",
            paragraphs: [
              "A process for detecting whether a selected representation differs from a separately trusted reference, subject to the hash algorithm, payload scope, serialization, and custody assumptions. A digest is not collision-free in the mathematical sense, and an attacker able to replace both copies can defeat a local comparison.",
            ],
          },
        },
        {
          title: "Integrity, Good Faith, and Authorized Consent",
          paragraphs: [
            "Diplomatic doctrine frequently invokes the principle of pacta sunt servanda (agreements must be kept) codified in Article 26 of the Vienna Convention on the Law of Treaties. Yet good faith cannot enforce itself in the absence of evidentiary certainty. When the factual content of what was agreed remains contestable, appeals to good faith merely mask the exercise of raw power.",
            "The UDCA's local seal is an implementation convention for comparing one selected payload with a stored baseline. It cannot eliminate ambiguity, compel good faith, or guarantee an audit trail against an attacker who can alter the application and its local storage. Any broader evidentiary process needs separately protected references, roles, and records.",
          ],
        },
        {
          title: "A Digest Cannot Authenticate a Treaty Text by Itself",
          paragraphs: [
            "The term authentication has a specific legal and diplomatic use as well as a technical one. Under the Vienna Convention on the Law of Treaties, authentication of a text is the procedure by which the text is established as authentic and definitive; a local application digest is not automatically that procedure. The parties may agree to a protocol that uses a cryptographic commitment, but they must also identify authorized representatives, the authoritative version, the effect of signatures, and how corrections are handled.",
            "An electronic record can be technically stable without being legally authoritative. A file may be an internal draft, a negotiating aide, a record of a unilateral position, or an instrument intended to express consent. The data format cannot decide which category applies. The workflow should label status and authorization separately from integrity so that a green digest badge is not mistaken for a legal conclusion.",
            "For a bilateral process, parties can agree on a shared protocol in advance: each side reviews the same text, validates the schema, exchanges a digest through an agreed channel, and records the authorized signatories and date. If they require signer attribution, they can use an approved digital-signature process. If they require official time, they can add a trusted timestamp. The relevant law and diplomatic practice determine whether those acts have legal effect.",
            "The process must address multilingual instruments and annexes. A digest over an English text does not establish that an Arabic, French, or other language version is equivalent or controlling. The agreement should specify which language texts are authentic, how discrepancies are resolved, and whether an annex is integral to the instrument. Cryptographic integrity can preserve the chosen files, but negotiation and law establish their relationship.",
          ],
        },
        {
          title: "Version Control, Redlines, and Human Authorization",
          paragraphs: [
            "Version control can reduce accidental divergence if each draft receives a stable identifier and a responsible editor. A clean process distinguishes a working draft from a text approved for exchange, records the source of each amendment, and prevents two branches from silently becoming 'the final copy.' The Handover Seal can help compare a selected payload, but it does not replace a document-management workflow with explicit approvals and access roles.",
            "Redlines encode meaning as well as character changes. A deletion can be a correction, a compromise, or a contested proposal. A digest records the resulting representation, not the reason for the edit or whether another delegation accepted it. Preserve amendment provenance and approval state in a separate structured record, and avoid treating the latest timestamp as proof that the latest draft has the highest authority.",
            "A strong process identifies who may draft, review, approve, initial, and transmit a text. It also defines how a late correction is made, how parties acknowledge receipt, and how an earlier version is withdrawn. The application can present the changed fields and preserve a local break event, but a human with delegated authority must decide whether to approve a new baseline.",
            "Version identifiers should be meaningful and immutable within the workflow, not merely incremented by a local browser. A digest can act as a content identifier, while a signed manifest can bind the digest to a schema version and role. Keep a retrieval path for the exact text represented by each identifier, subject to retention and confidentiality policy. A digest without retrievable content may prove a comparison but leave the reviewer unable to understand the record.",
          ],
        },
        {
          title: "Interpreting the Historical Record Without Technological Anachronism",
          paragraphs: [
            "The archival cases in this chapter predate modern web cryptography. Their value lies in the recurring challenges of version control, translation, custody, and competing interpretation. It would be anachronistic to say that a twentieth-century negotiation failed because it lacked SHA-256 or that a browser hash would have prevented political disagreement. The historical analysis should identify the actual institutional and textual conditions documented by primary records.",
            "Primary sources can include the correspondence itself, official treaty texts, meeting records, later explanatory statements, and parliamentary or archival collections. Secondary scholarship can help interpret them but may disagree. A reading list should let the student distinguish the source document from commentary and should identify the exact proposition each source supports.",
            "Digital integrity is one modern response to a narrower evidentiary problem: whether a later copy matches a chosen baseline. It does not repair ambiguous wording, unequal bargaining power, omitted stakeholders, incomplete translation, or non-implementation. A well-preserved text may expose these problems more clearly, but only negotiation, interpretation, and institutional enforcement can address them.",
            "The postgraduate method is comparative rather than triumphalist. Ask what analog seals, initials, registries, witnesses, and archives were designed to accomplish; identify their failure modes; then evaluate what digital hashes add and what new risks they introduce. A cryptographic record may be easier to copy and verify, yet more dependent on software, keys, time sources, and schema governance.",
          ],
        },
      ],
      statutoryRule: "Internal UDCA convention—not law: an unsealed assessment may still be evidence under applicable rules. A digest can support comparison of a defined payload but does not make that payload immutable or confer legal admissibility.",
    },
    {
      heading: "II. The Mathematics of Canonical JSON Serialization",
      subheading: "Defining an interoperable representation without claiming standards conformance",
      paragraphs: [
        "To compare structured records by digest, the data must be converted into a defined sequence of bytes. JSON is widely used for interchange, but RFC 8259 defines objects as unordered collections of name/value pairs. Producers can serialize equivalent objects differently, so a cross-language comparison needs an explicit representation rule rather than an assumption that all ordinary serializers emit identical bytes.",
        "Object member order is not a semantic part of a JSON object in RFC 8259, even though JavaScript serialization defines predictable property enumeration rules for many values. A system that hashes JSON should not rely on an informal expectation about insertion order across producers, runtimes, or languages. RFC 8785 addresses this interoperability problem with a defined scheme. For this application the relevant behavior is the registry helper's explicit sort and normalization logic, not the claim that V8 randomly permutes keys.",
        "A cryptographic hash operates on bytes: two different serialized strings ordinarily produce different digests, even when a human considers their JSON objects equivalent. That mismatch can cause a verification failure, but it does not by itself establish tampering, espionage, or bad faith. A defined canonicalization profile helps independent parties compare the intended representation.",
        "RFC 8785 is a useful comparison because it specifies a canonical representation based on ECMAScript primitive serialization, I-JSON constraints, and deterministic property sorting. The local canonicalJson function shares the recursive key-sorting idea but has its own treatment of unsupported values and does not claim full JCS conformance. Its numeric serialization comes from JSON.stringify after non-finite values are mapped to null; arrays retain their order. A standard's name should not be used as a conformance claim without implementing and testing all of its requirements.",
      ],
      formulas: [F_SEAL],
      caseStudy: {
        title:         "The 2015 Minsk II Package: Text, Sequence, and Implementation",
        jurisdiction: "Normandy Format (Germany, France, Russia, Ukraine) / OSCE",
        precedent: "The OSCE-published Package of Measures agreed on 12 February 2015",
        analysis: [
          "The Package of Measures for the Implementation of the Minsk Agreements was agreed by the Trilateral Contact Group at Minsk on 12 February 2015. The OSCE hosts the document and identifies it as the Russian-language version. It contains thirteen measures addressing, among other matters, a ceasefire, withdrawal of heavy weapons, elections, constitutional changes, and border control.",
          "The package links restoration of Ukrainian control over the state border to local elections and a comprehensive political settlement, and separately sets out constitutional reform and decentralization provisions. The sequence and qualifications should be checked against the exact text and any agreed translation; the OSCE-hosted page identifies its copy as Russian-language. Describing these clauses as a single 'fatal ambiguity' would overstate what the document alone shows.",
          "Disputes over the package's interpretation and implementation occurred in a wider political and security context. A careful account separates the agreed text from the positions of parties and later analysis. This chapter does not attribute implementation failure to serialization, document custody, or a particular digest mechanism.",
          "The bounded technical analogy is that a digest could show whether two reviewers are examining the same file, provided they agree on the file and protect the reference. It cannot supply an agreed sequence beyond the text, settle disagreements about meaning, verify compliance on the ground, or cause implementation.",
        ],
        failureMechanism: "The package's implementation depended on political and security conditions and parties' actions. The text is a primary source for what was agreed, not proof that a serialization defect caused later disputes.",
      },
      subsections: [
        {
          title: "Lexicographical Sorting Across Arbitrary Nesting Depths",
          paragraphs: [
            "The helper traverses values recursively. For an object, it obtains enumerable own keys with Object.keys, sorts them using JavaScript's default string sort, then copies supported values into a fresh object before JSON.stringify. That string sort is based on UTF-16 code units. A further JavaScript detail matters: integer-index-like property names are enumerated numerically by JSON.stringify, so this helper should not be described as a general RFC 8785 implementation or assumed to produce a cross-language canonical ordering for every possible key. Arrays are mapped in sequence; undefined and function entries become null, while those properties are omitted from objects. Non-finite numbers become null.",
            "The implementation does not explicitly detect circular references; JSON.stringify will fail when it encounters a cycle. Nor does it preserve non-enumerable properties, symbol keys, prototypes, or arbitrary class semantics. The handover payload is deliberately constructed from a constrained set of plain records, so the intended input domain is narrower than all JavaScript values. An interoperable verifier should validate the expected schema and reject unsupported structures rather than silently pretending to serialize every possible object.",
          ],
          callout: {
            kind: "definition",
            title: "Canonical Serialization Invariant",
            paragraphs: [
              "A versioned procedure that maps inputs accepted by a defined schema to bytes in a predictable way. The schema must define which differences are meaningful; the serializer's output alone does not prove that distinct real-world meanings remain distinct or that the resulting digest is collision-free.",
            ],
          },
        },
        {
          title: "Array Order Conservation and Unicode Normalization Timing",
          paragraphs: [
            "A critical distinction in canonical serialization exists between object keys and array elements. While dictionary keys possess no intrinsic semantic order and must be sorted alphabetically, array indices represent intentional, ordered sequences. In the UDCA, array order is strictly preserved. In the Decision Log, chronology dictates evidentiary validity: event \\(E_1\\) precedes event \\(E_2\\). Reordering array elements would corrupt the causal narrative of the negotiation.",
            "The field sanitizer applies NFC on paste and blur for covered editable text, rather than normalizing during hashing. Consequently, any code point already present in the stored value is serialized as it is received by canonicalJson. NFC does not remove every invisible character or make confusable glyphs equivalent. A reviewer should inspect suspicious characters and report them; an integrity checker should not erase them before digesting the record.",
          ],
          callout: {
            kind: "bridge",
            title: "The Tamper Masking Hazard",
            paragraphs: [
              "Canonicalization intentionally defines a representation of structured data, so it can disregard differences such as object property order. That is not permission to normalize arbitrary content. The verifier must apply the same documented transformation and must not silently alter text values in a way that hides a meaningful change.",
            ],
          },
        },
        {
          title: "JSON's Data Model and Duplicate-Member Hazards",
          paragraphs: [
            "RFC 8259 defines JSON objects as collections of name/value pairs and notes that behavior can be unpredictable when names are not unique. Once a parser has accepted duplicate member names, one implementation may retain the first occurrence, another the last, and another may reject the object. Sorting keys after parsing cannot recover a discarded duplicate or prove which value an earlier producer intended. For a sealed format, validate unique names at the boundary and reject ambiguous input before canonicalization.",
            "A JavaScript object is richer than JSON. It can contain prototypes, accessors, symbols, functions, undefined values, non-finite numbers, and cycles. The helper produces a deliberately reduced representation of that object graph. The input type `unknown` is a reminder that a runtime value is not automatically a valid seal payload. Construct a typed payload from approved fields, validate its shape and ranges, and only then serialize it.",
            "JSON numbers are text but JavaScript represents ordinary numbers as IEEE 754 binary64 values. Very large integers may not be exactly representable; values outside the interoperable range can be rounded before serialization. If a diplomatic record requires exact decimal or integer fidelity, choose a schema that represents such values as validated strings or a precisely specified decimal type rather than assume that a floating-point JSON number preserves every digit.",
            "A parser and serializer can also differ in how they handle escaped characters, line separators, invalid Unicode sequences, or exponent notation. RFC 8785 narrows the allowed input and defines number and string serialization so independent implementations can agree. This application uses its own JSON.stringify-based output over a restricted payload. Its compatibility promise should be limited to tested input values and the actual supported browser/runtime versions.",
          ],
        },
        {
          title: "Canonicalization as a Versioned Protocol",
          paragraphs: [
            "A canonical form is a protocol between producers and verifiers. It must define the accepted schema, property ordering, value types, omission rules, array semantics, numeric constraints, string handling, and encoding. If one party silently changes any of these rules, a digest mismatch may reflect a format-version change rather than tampering. Include an explicit schema identifier in the protected payload or transport wrapper and define how readers handle unknown versions.",
            "Migration should be explicit and loss-aware. A new implementation may need to parse an older record, preserve its original canonical text, and create a separately labelled migrated payload. Rewriting an old record under a new serializer without preserving the original can destroy the ability to reproduce its historical digest. A migration record should identify source version, target version, transformation, and reviewer.",
            "Changing a field's meaning is as consequential as changing its encoding. A property named `assessmentDate` might once mean source publication date and later mean analyst entry date; a syntactically valid canonical record can still be semantically incompatible. Schema definitions should include units, enumerations, nullability, and lifecycle meaning, with tests for both accepted and rejected examples.",
            "Interoperability tests should run in the actual languages and environments expected for handover. A browser-generated digest should be recomputed by an independent verifier from the canonical text, not from a screen rendering. Verify the original UTF-8 bytes and the algorithm label; reject ambiguous schema versions. Document any unsupported inputs and ensure the UI surfaces them before a seal is created.",
          ],
        },
        {
          title: "Unicode, Confusables, and Legal Text",
          paragraphs: [
            "Unicode normalization solves a limited problem: canonical equivalence among certain sequences. It does not establish that two strings refer to the same person, territory, legal concept, or transliteration. NFC may convert a decomposed sequence to its canonical composed form while preserving compatibility distinctions. NFKC applies broader compatibility mappings that can change presentation distinctions and may be unsuitable for exact legal text.",
            "Visually confusable characters are a separate problem. Latin and Cyrillic letters can look similar while having different code points; bidirectional controls can reorder display; zero-width characters can be invisible. A verifier that hashes the stored code points will detect an edit when the bytes differ, but a human reviewer may still misread the display. An integrity display should expose code-point anomalies or provide a safe inspection mode without altering the underlying record.",
            "Input sanitization should be context-aware. The project's field handling sanitizes free text on paste and blur rather than on each keystroke, uses NFC rather than NFKC, and does not normalize dynamically during verification. This avoids caret disruption and meaning-changing compatibility normalization while preserving the verifier's ability to detect a changed record. The policy does not prove that all control characters or deceptive content are removed.",
            "For multilingual instruments, preserve the authoritative text and its translation lineage. A canonical JSON digest can cover exact Unicode sequences and language labels, but it does not determine which version controls or whether a translation is legally authentic. Include the language tag, translator or source reference where authorized, and a human review process for disputed renderings. Interpretive questions remain governed by the instrument and applicable law.",
          ],
        },
      ],
      statutoryRule: "Internal UDCA implementation convention—not law: the current canonicalJson helper sorts object keys, preserves array order, and applies the specific value handling described in this chapter. Verification must use the same stated profile and must not silently normalize stored text.",
    },
    {
      heading: "III. The Web Crypto SHA-256 Pipeline & Handover Sealing Architecture",
      subheading: "Client-Side Cryptographic Primitives and the Mechanics of the Handover Seal",
      paragraphs: [
        "Once the selected mission state has been converted into canonical JSON text, the application passes UTF-8 bytes to the browser's SubtleCrypto digest operation with SHA-256. The Web Cryptography API defines a standardized interface for cryptographic operations; it does not certify that the surrounding page is secure or that its input is complete. A local deployment may calculate the same digest without sending the payload to a service, but that is a property of the workflow and network behavior to verify, not a feature inherent in SHA-256.",
        "FIPS 180-4 specifies the Secure Hash Standard, including SHA-256. Its output is 256 bits, conventionally rendered as 64 hexadecimal characters. The details of preprocessing, message schedule, rounds, and state updates are important for implementing or validating the primitive; an application using SubtleCrypto delegates that primitive to the user agent. The application still owns the encoding and data-selection decisions before the API call, which must be reviewed independently.",
        "Collision resistance and preimage resistance are computational security goals, not proofs that a digest is unique in an absolute mathematical sense. SHA-256 has a 256-bit output space, with \\(2^{256} \\approx 1.1579 \\times 10^{77}\\) possible digest values. Generic collision search has a birthday-bound work factor near \\(2^{128}\\), while generic preimage search has a work factor near \\(2^{256}\\), under idealized assumptions. Neither bound means a digest encrypts its input or guarantees confidentiality: an attacker can hash guesses for low-entropy content. These are estimates of generic attack effort, not absolute guarantees.",
        "The seal payload is explicitly constructed from profile, binder, signals, and selected decision records; seal and reseal actions are filtered to avoid a self-reference. The digest and canonical payload are kept with the seal in tab sessionStorage. That local checkpoint can detect a later mismatch if the stored reference remains trustworthy, but the same browser environment can be manipulated. Independent verification requires a protected reference, and attribution requires an authenticated signature or another trusted custody mechanism.",
      ],
      caseStudy: {
        title: "The 1994 US-DPRK Agreed Framework: Verification and Sequencing",
        jurisdiction: "Geneva Bilateral Talks / IAEA Safeguards Directorate",
        precedent: "Disputed nuclear facility baselines and delayed light-water reactor financing",
        analysis: [
          "The Agreed Framework, concluded in October 1994 by the United States and the Democratic People's Republic of Korea (DPRK), set out reciprocal steps concerning the DPRK's graphite-moderated reactors and related facilities, a light-water-reactor project, fuel oil, and movement toward political and economic normalization. Its text provides the primary basis for describing those commitments; it was not a cryptographic record or a treaty audit log.",
          "The framework assigned the International Atomic Energy Agency (IAEA) a role in monitoring the freeze and stated that the DPRK would come into full compliance with its safeguards agreement, including taking all steps the IAEA deemed necessary, before delivery of key nuclear components. The document's sequencing and verification provisions can be examined directly rather than recast as an absent digital baseline.",
          "The text ties its commitments to the existing safeguards agreement and sets out the point at which the DPRK would take required safeguards steps. That provision illustrates why a verification arrangement must identify the inspecting institution, the applicable agreement, access requirements, and the relationship between technical findings and political decisions.",
          "The text's implementation depended on reciprocal commitments, institutional verification, and political decisions. The case supports a bounded lesson: a digest can preserve a selected agreement or report, but cannot supply inspection rights, establish the completeness of a declaration, or cause compliance.",
        ],
        failureMechanism: "Absence of an immutable baseline and lack of continuous, tamper-evident inspection ledgers allowed both parties to exploit technical loopholes, culminating in treaty renunciation and regional nuclear crisis.",
      },
      subsections: [
        {
          title: "Anatomy of the Canonical Seal Payload",
          paragraphs: [
            "The Handover Seal does not ingest raw UI component state. Ephemeral presentation attributes, such as active tab indexes, scroller coordinates, and dark-mode toggles, are strictly excluded from the seal boundary. Ingesting presentation state would cause innocuous user interactions to invalidate an authentic diplomatic seal.",
            "The sealPayload constructor selects four dimensions: a profile containing theatre, envoy, mandate, parties, and session identifier; binder arrays for facts, assumptions, and exclusions; a JSON-cloned signal snapshot; and decision records with selected fields. It filters seal and reseal actions from the included decision records because a seal record contains its resulting hash. This scope should be documented as a schema, because an omitted field is not protected by the digest merely because it exists elsewhere in the workspace.",
          ],
          callout: {
            kind: "definition",
            title: "The Self-Referential Hash Paradox",
            paragraphs: [
              "A cryptographic hash cannot contain its own digest within its hashing payload. In the UDCA, the seal action and reseal actions are stripped from the decision list before canonical serialization, preventing infinite mathematical recursion.",
            ],
          },
        },
        {
          title: "Session Storage Confinement and the Panic Eviction Hook",
          paragraphs: [
            "The key vs:handover-seal is written to sessionStorage for the current browser page session. WHATWG describes this as page-session storage, which differs from localStorage's longer-lived area but does not mean that data exists only in volatile RAM. Browser recovery, user profile access, local forensic tools, and operating-system backup behavior are outside the digest function and must be considered separately.",
            "The panic path requests removal of designated browser state and clears selected application buffers. Storage operations can fail, the browser may refuse clipboard access, and strings or copies outside a mutable buffer are not erased by zeroizeBuffer. The dashboard owns the response. A successful call indicates that the application attempted those actions, not that every device artifact has been forensically sanitized.",
          ],
          callout: {
            kind: "bridge",
            title: "The Enclave Handoff",
            paragraphs: [
              "When an operator preserves a workspace using the enclave path, confidentiality and integrity depend on the actual encryption implementation, key derivation, passphrase strength, random salt and IV handling, authenticated decryption, and key lifecycle. An inner SHA-256 digest can identify change in the plaintext payload but is not itself an authentication tag. Do not equate 'hash embedded in encrypted data' with a digital signature or external proof of custody.",
            ],
          },
        },
        {
          title: "The Web Crypto API and Its Assurance Boundary",
          paragraphs: [
            "The Web Cryptography API exposes low-level operations through SubtleCrypto. In a browser, access to the interface is generally restricted to secure contexts, with localhost treated specially for development. An application must handle unsupported contexts, rejected promises, unavailable APIs, and runtime errors. A failed digest should be displayed as unavailable; it must not leave a stale green indicator that could be mistaken for a successful current verification.",
            "The API standardizes method names, accepted algorithm identifiers, input types, and result forms. It does not certify the operating system, browser build, page scripts, dependency provenance, key custody, or correctness of the application's payload. Browser vendors may use different internal implementations while implementing the same API. Testing the API call is therefore necessary but not a full security audit.",
            "SHA-256 is an unkeyed digest operation. Web Crypto also provides keyed and asymmetric cryptographic operations, but using them safely requires key generation or import policy, identity binding, access control, rotation, revocation, and recovery. A code sample that calls digest is not a signature workflow. If a handover needs authenticated origin, design a signature protocol with a protected signing key and a verifier that checks authorization.",
            "Cryptographic calls are asynchronous and can overlap with edits. If the user changes a payload while a digest promise is pending, the UI must associate the result with the exact canonical input that produced it. Use a request or revision identifier and ignore stale completions. A robust test delays one digest, starts a newer one, and confirms that the older completion cannot replace the current status.",
          ],
        },
        {
          title: "Digest Formatting and Independent Recalculation",
          paragraphs: [
            "A SHA-256 digest consists of 32 bytes. Hexadecimal formatting maps each byte to two characters, so a lowercase hexadecimal rendering has 64 characters. This length is a representation convention, not a 64-byte cryptographic value. An implementation should validate the expected alphabet and length when reading a stored digest, but syntactic validity alone does not establish that the digest corresponds to a trusted payload.",
            "The canonical text should be treated as the primary input to an independent recomputation. If a recipient is sent only a screenshot or a short badge prefix, the full digest is unavailable and the underlying bytes cannot be reconstructed. If the canonical text is retained with the seal, it helps reproduce the computation, but because it is stored locally with the digest, it is not an independent witness.",
            "Byte encoding must be explicit. The application uses TextEncoder to convert text to UTF-8 before hashing. A verifier should use the same encoding and should not add a byte-order mark, trim whitespace, normalize line endings, or decode and re-encode through a lossy charset unless the protocol explicitly requires that transformation. The same visible text may have different bytes if preprocessing differs.",
            "A reproducibility record should include the schema version, algorithm identifier, canonical text or a secure means of retrieving it, full digest, application release, and verification date. If the data is sensitive, control access to the canonical record and avoid publishing a plain digest that permits guessing. The audit should be able to recompute the hash without treating a UI badge as the source of truth.",
          ],
        },
        {
          title: "Seal Lifecycle and Operational Checkpoints",
          paragraphs: [
            "A seal is useful only when its lifecycle is understood. Define who may create it, which fields it covers, when a change requires resealing, who reviews the changed payload, and how the previous reference is preserved. If every minor edit automatically generates a new seal, the operator may lose the distinction between an approved checkpoint and an unreviewed working state.",
            "Creation and replacement are different events. A first seal establishes a baseline; a replacement may supersede a prior digest; a break indicates a mismatch or removal. The local ledger can display these actions, but it does not by itself guarantee append-only custody. A separate export or protected audit system may be appropriate when institutional policy requires independent retention.",
            "A well-designed handover provides the recipient with both content and context: the payload version, included and excluded fields, digest algorithm, verification instructions, authorizing role, and any known divergence. The recipient should know whether the baseline was signed, externally witnessed, or merely stored in a browser tab. Ambiguity about custody can be more damaging than a transparent statement that the seal is local only.",
            "Treat resealing as an auditable decision, not a way to make an amber warning disappear. Before approving a new baseline, compare old and new canonical payloads, classify each changed field, confirm the authority and evidence for the change, and record the reason. If a suspected unauthorized change occurred, preserve evidence and follow incident policy before creating a replacement digest.",
          ],
        },
      ],
      statutoryRule: "Internal UDCA implementation convention—not law: the seal is stored in this tab's sessionStorage, which is not a guarantee of RAM-only storage. Panic cleanup attempts to clear designated state; storage and clipboard operations can fail.",
    },
    {
      heading: "IV. Divergence Detection, Lineage Auditability, and Legal Limits",
      subheading: "The Divergence Beacon, Parameter-Level Diffing, and the Epistemic Limits of Cryptography",
      paragraphs: [
        "The seal supports a comparison between a stored canonical baseline and the current selected payload when the application evaluates divergence. The comparison cadence and trigger are properties of the current UI wiring, not a guarantee of an always-running background monitor. Browser scheduling can pause work when a tab is hidden. A status indicator should therefore be read as the latest completed comparison, not as proof that no change has occurred since the last evaluation.",
        "If the current digest matches the stored reference, the comparison indicates that the selected canonical payload matches under SHA-256. A changed included field will ordinarily produce a different digest; the application can then present a divergence status and inspect the canonical values. This is not a continuous forensic monitor, and it cannot notice changes to omitted fields or changes made before the baseline was created.",
        "Crucially, the system does not simply report a binary failure. The Divergence Inspector performs a deep structural diff between the sealed baseline and the current state vector. It enumerates the precise parameters that have shifted, indicating whether interpersonal bond resilience decreased, an escrow trigger was modified, or an unauthorized decision was logged. This provides sovereign delegates with instantaneous forensic clarity regarding exactly how and where an assessment was altered.",
        "When legitimate operational revisions occur, the operator may execute a Reseal command. The UI can record replacement or break events in the local Decision Ledger, but that log is not independently immutable and does not guarantee permanent retention. If a legal or diplomatic process requires an unalterable record, it must establish protected custody, access control, preservation, and an external verification or signature mechanism beyond this local log.",
      ],
      caseStudy: {
        title: "Source Analysis: RFC 3161 and Trusted Timestamps",
        jurisdiction: "IETF Internet X.509 Public Key Infrastructure",
        precedent: "RFC 3161 defines a protocol for requesting and verifying time-stamp tokens",
        analysis: [
          "RFC 3161 defines a time-stamp protocol in which a requester submits a message imprint and a time-stamp authority returns a signed token under the protocol. The verifier checks the token and the authority's certificate and policy. A timestamp can provide evidence that a digest was presented to that authority under the stated trust model.",
          "A token does not reveal or authenticate the underlying document by itself. It does not show that the document was complete, that its claims were true, that a named official had authority, or that a party consented to a treaty. The result depends on the token, the authority's signing key, certificate status, policy, and verification procedure.",
          "The current UDCA Handover Seal stores a local timestamp and digest in sessionStorage; it does not request or verify an RFC 3161 token. Therefore the local `sealedAt` value is application metadata, not trusted third-party time evidence. A display of an ISO-formatted date does not change that status.",
          "If a mission requires independent time evidence, the parties must approve the authority, protocol, data disclosure, retention, and verification steps. Sending even a digest to an external service can create linkability or reveal operational timing. The use of a trusted timestamp is a separate policy and custody decision, not an automatic benefit of hashing.",
        ],
        failureMechanism: "A timestamp can support a bounded claim about presentation of a digest to an authority; it cannot establish content truth, completeness, signer authority, or consent.",
      },
      subsections: [
        {
          title: "Hash-Chain Models and the Current Ledger's Limits",
          paragraphs: [
            "A hash chain is one possible design for linking records: each new digest can include the preceding digest and the next event's canonical content. In that hypothetical design, event node \\(N_i\\) follows the illustrative recurrence \\(N_i = \\text{SHA-256}(N_{i-1} + \\text{timestamp} + \\text{action} + \\text{details})\\); this is not the current handoverSeal implementation. The actual Decision Ledger module is a local audit record, not an implemented Merkle chain.",
            "If a record at index \\(k\\) is altered in that design, its successor at index \\(k+1\\) would no longer match unless subsequent digests were recomputed. Even a correctly implemented hash chain is not inherently immutable: an attacker able to rewrite all records and recompute every digest can leave the chain internally consistent. Tamper evidence requires a protected checkpoint, signature, external witness, or other independently controlled root.",
          ],
          callout: {
            kind: "definition",
            title: "Decision Chain Recursion Invariant",
            paragraphs: [
              "In this illustrative chain, and not in the current Decision Ledger, for all events \\(i > 0\\), the cryptographic node \\(N_i\\) strictly incorporates the digest of node \\(N_{i-1}\\). An empty ledger produces the standard SHA-256 digest of the empty byte string.",
            ],
          },
        },
        {
          title: "What a Hash Match and Divergence Diff Actually Mean",
          paragraphs: [
            "The same digest is a compact equality check over the bytes that were submitted to the hash. It does not disclose where a changed field is located. This application can locate differences because it retains and compares canonical payload content; the structural diff is an additional application function, separate from SHA-256. A digest alone cannot identify whether a bond, a note, or a timestamp changed, and a displayed path is only as accurate as the diff implementation.",
            "The field scope is equally important. If sealPayload trims certain profile strings, the digest commits to the trimmed form rather than the original whitespace the operator typed. If it selects only particular decision fields, an omitted field does not affect the seal. If a signal is absent from the source object, JSON handling may omit or transform it. A reviewer should inspect the payload constructor and the serialized canonical string, not infer coverage from the screen's appearance.",
            "A hash comparison can also be fooled at the trust boundary. Suppose an attacker can edit both the baseline seal and current state, or replace the application bundle that performs the comparison. The application may report a match over attacker-selected bytes. Independent verification should therefore obtain the baseline through a separately protected channel, validate the code release, and compare the payload in a clean environment. A signed digest can bind the origin if signing keys and identity checks are trustworthy.",
            "A divergence warning does not automatically prove malicious tampering. It may result from an authorized update, changed input, a schema migration, different trimming behavior, or a serialization bug. Incident handling should preserve the original baseline and current payload, record the software version, identify the change path, and determine whether the update was authorized. The status should motivate review rather than serve as a verdict about intent.",
          ],
        },
        {
          title: "Hashing, Signatures, Encryption, and Trusted Time",
          paragraphs: [
            "These primitives answer different questions. A cryptographic hash produces a fixed-size digest for comparison. Symmetric authenticated encryption can provide confidentiality and integrity to parties holding a shared key. A message authentication code authenticates data to holders of that key but does not distinguish which holder created it. A digital signature can be verified with a public key and can support attribution under a key-management policy. None of these by itself establishes when a record existed unless trusted time evidence is added.",
            "A digital signature over a canonical payload can help a recipient check that a holder of a private signing key approved the signed bytes. But a signature says nothing about whether the key was authorized for the diplomatic act, whether it was compromised, or whether the signer had authority to bind a state. Certificate validation, key revocation, identity proofing, delegation, audit, and governing law determine what the signature means in context.",
            "Encryption protects confidentiality against parties lacking the key; a digest does not. If the record contains low-entropy values, an observer who sees the digest can test hypotheses offline. Adding an unkeyed nonce may prevent some precomputation but does not turn a hash into a confidentiality mechanism. Use a standard authenticated-encryption scheme for confidentiality and integrity, and keep key derivation and passphrase handling within the reviewed implementation.",
            "A trusted timestamping service can attest that a digest was presented at a time according to a defined authority and protocol; it does not prove that the underlying statement is true or that the signer had state authority. External anchoring can improve evidentiary independence while introducing a new recipient, metadata, availability, and jurisdictional path. The institution must decide whether those tradeoffs are acceptable and document them in the custody plan.",
          ],
        },
        {
          title: "Reproducible Verification and Test Vectors",
          paragraphs: [
            "Interoperability requires tests at every transformation boundary. A fixture should specify the input object, expected selected payload, canonical JSON text, UTF-8 bytes, and final digest. This lets a reviewer distinguish a payload-selection error from key-ordering or hash errors. Include nested objects, empty arrays, Unicode text, control characters, negative zero, fractional values, non-finite numbers, undefined object properties, undefined array elements, and a deliberate cycle that should fail rather than yield a misleading digest.",
            "Use published SHA-256 test vectors to validate the cryptographic primitive independently, then test the application's wrapper with a known UTF-8 string and expected digest. RFC 8785's examples are useful for comparing a JCS implementation, but they must not be presented as proof that this custom serializer conforms. A compatibility test should explicitly document where the application's intended domain overlaps the RFC and where handling differs.",
            "Test mutation detection by changing one included field at a time and by changing fields deliberately excluded from the payload. The former should cause a different canonical payload; the latter should remain outside the seal's stated scope. Test record ordering: binder arrays and decision arrays preserve sequence, so reordering them changes the payload even where a human might regard the entries as equivalent. That behavior should reflect the intended semantics, not an accidental assumption.",
            "Verification should fail closed when parsing, encoding, hashing, or storage access fails. Display a clear unavailable or error state rather than leaving a previously green badge unchanged without qualification. Test asynchronous races as well: if a second payload is computed while a first digest is pending, the first completion must not overwrite the latest result. A trustworthy user interface exposes the time and version of the latest successful comparison.",
          ],
        },
        {
          title: "Evidence, Consent, and the Law of Treaty Form",
          paragraphs: [
            "A cryptographic digest can support a chain-of-custody narrative if the parties agree in advance on the payload schema, hashing method, canonicalization, custody roles, and verification procedure. It cannot retroactively create that agreement. Where parties need a common record, they should identify authoritative texts, language versions, authentication procedures, correction mechanisms, signatures or initials, and how appendices and later amendments relate to the main instrument.",
            "The Vienna Convention on the Law of Treaties distinguishes the conclusion and authentication of treaty text from the expression of consent to be bound. Relevant provisions include Articles 10 to 16, subject to treaty participation and applicable rules. A local handover hash is not one of those legal acts simply because it is called a seal. Whether an electronic signature or record satisfies domestic law or treaty requirements depends on the applicable law and parties' intent.",
            "Language ambiguity is not solved by byte-level stability. Canonicalizing two equally ambiguous translations preserves each version without choosing the legally controlling meaning. The VCLT rules on interpretation, including ordinary meaning, context, object and purpose, and authenticated language texts, remain relevant. A drafting protocol should state how translations are reviewed and which text controls in case of divergence.",
            "An evidentiary dossier should therefore separate the exact text, translation lineage, authorizations, meeting minutes, witness records, and technical digest. Protecting the binary representation can be valuable, but the institution must also preserve the human and legal context needed to interpret what was agreed. A secure hash should strengthen a custody process, never become a substitute for one.",
          ],
        },
        {
          title: "Integrity, Truth, and Legal Effect Are Separate Questions",
          paragraphs: [
            "A digest comparison addresses the integrity of selected bytes under stated assumptions; it does not validate the underlying intelligence. A false, incomplete, outdated, or biased assessment can be represented consistently and produce a stable digest. Review of source quality, corroboration, analytic uncertainty, and the authority to record a conclusion remains a human and institutional responsibility.",
            "A browser seal does not itself constitute treaty authentication or consent to be bound. The Vienna Convention on the Law of Treaties addresses authentication and consent through its own provisions, and domestic constitutional rules may also apply. Whether any electronic signature or record has legal effect depends on the applicable law, the parties' intent, authorized signatories, and the prescribed procedure. A local SHA-256 digest should not be described as ratification.",
          ],
          callout: {
            kind: "bridge",
            title: "The Legal and Institutional Limits of Cryptography",
            paragraphs: [
              "Never confuse the mathematical integrity of a container with the political or moral truth of its contents. Cryptography protects statecraft against tampering; statecraft itself remains the sovereign responsibility of human leadership.",
            ],
          },
        },
        {
          title: "Canonicalization as a Cross-Implementation Protocol",
          paragraphs: [
            "A canonical representation is not a vague promise that two serializers will produce similar-looking text. It is a protocol: both parties must agree on the accepted input model, the selected fields, normalization rules, property ordering, escaping, numeric formatting, character encoding, and error behavior. A verifier that matches the digest only after guessing one of these choices has not independently reproduced the seal. The protocol should therefore be versioned and made available alongside test fixtures.",
            "The repository helper takes JavaScript values, sorts enumerable object keys recursively, applies its stated treatment of undefined and function values, maps non-finite numbers to null, and delegates final textual serialization to JSON.stringify. Those behaviors occur before SHA-256 sees bytes. A verifier written in another language cannot directly reproduce JavaScript-only values such as undefined; it needs the original pre-normalized record or an explicit description of the transformation that removed them.",
            "Numeric edge cases deserve separate tests. JSON number syntax does not preserve every source-language numeric representation; negative zero, large integers, exponent forms, and floating-point rounding can have language-specific consequences. The JCS RFC defines interoperability rules for a constrained JSON data model, but the existence of sorted keys alone does not establish that a custom serializer satisfies all of them. Protocol owners should use published vectors where applicable and add application-specific fixtures for intentional divergences.",
            "Unicode handling is another boundary. The canonical serializer preserves the string values it receives; NFC normalization belongs to field sanitization policy and should not be silently inserted into verification after the fact. Two canonically equivalent strings can have distinct code-point sequences and therefore distinct UTF-8 bytes. If an application normalizes on paste or blur, the verifier must receive the actual post-sanitization stored value, while the record should not be rewritten merely to force a matching digest.",
            "A useful wire format carries a schema identifier, canonicalization profile, algorithm name, and version alongside the digest, while ensuring those identifiers are themselves bound to the record or otherwise authenticated. If the format changes, create a new profile rather than reinterpret old digests under new rules. Version negotiation prevents accidental cross-version mismatch, and strict rejection of unknown profiles prevents a verifier from silently applying a convenient but incompatible default.",
          ],
        },
        {
          title: "Digest Verification, Authentication, and Trust Anchors",
          paragraphs: [
            "A message digest answers a narrow comparison question: does the selected byte sequence produce the same digest under the named hash algorithm? It does not answer who created the bytes. If a sender transmits a document and its hash through the same untrusted channel, an intermediary can replace both. Verification of integrity against a reference is meaningful only if the reference itself is trusted independently of the object being checked.",
            "A digital signature can bind a private-key operation to a digest and allow verification with a corresponding public key, but it does not automatically identify the human or office responsible. The verifier must establish that the key belongs to an authorized signatory, that its use was within scope, and that it was valid at the relevant time. Key revocation, compromise, delegation, certificate policy, and algorithm lifecycle are governance matters as well as cryptographic details.",
            "Alternative trust anchors include a separately controlled archive, an authenticated bilateral exchange, a witnessed ceremony, or a transparency log administered under agreed rules. Each changes the custody model. An external log can improve detection of later alteration while exposing metadata and creating a new availability dependency. A counterpart's independently received digest may establish agreement between copies, but only if both parties' identity and transmission channels are authenticated.",
            "The current browser seal uses a local digest comparison and should be described at that scope. A matching digest is evidence that the compared payload and stored reference are byte-equivalent under the application's canonicalization behavior; it is not evidence that the reference was approved by a particular envoy or that it was never replaced. If stronger origin assurance is required, define a separate signature protocol, key enrollment and revocation, authorization checks, and independent verification workflow rather than assuming a hash already supplies them.",
            "A strong verification report records the source of the reference digest, the identity and authority of any signer, the algorithm and schema, the verifier implementation and version, and any warnings. It should preserve the original artifact, not only a screenshot of a green indicator. The report must also identify what was excluded from the seal. This scope statement prevents a verifier from treating a successful digest comparison as validation of every related file or event.",
          ],
        },
        {
          title: "Key Custody, Separation of Duties, and Lifecycle",
          paragraphs: [
            "Cryptographic assurance depends on key lifecycle decisions that are invisible in a simple digest display. If a future deployment adds signatures or encrypted archives, it must specify how keys are generated, bound to institutional identities, stored, backed up, activated, rotated, revoked, and destroyed. Each phase has different threats. A private key exposed during enrollment can invalidate every later signature, while an unavailable key can make legitimate records unverifiable.",
            "Separation of duties reduces the risk that one compromised account can both alter a record and validate its own alteration. For example, an author may prepare a handover, a second authorized officer may approve it, and an archive custodian may retain the signed artifact. The exact roles depend on diplomatic protocol and local law; cryptography can enforce or record some steps only after the institution defines them. A shared workstation account or one person controlling all credentials defeats nominal role separation.",
            "Key backup introduces a difficult balance. Recovery copies prevent permanent loss but create additional attack surfaces and custodians. A backup should have explicit access control, encryption, recovery testing, and an inventory. If a hardware-backed key is claimed, verify the specific platform, browser, and key API behavior rather than inferring hardware protection from the presence of a non-extractable CryptoKey. Non-extractability limits export through an interface; it does not prevent authorized code from using the key handle.",
            "Compromise response should distinguish suspected exposure from confirmed misuse. Revoke or suspend credentials under a documented procedure, identify records signed by the affected key, preserve evidence, and issue replacement keys only after identity and device checks. Historical signatures may require trusted timestamps or revocation-time evidence to establish whether they predate compromise. A locally displayed creation time is not a substitute for that external evidence.",
            "Because this implementation computes an unkeyed hash, key-custody controls do not magically apply to its current seal. The operational lesson is to avoid describing cryptographic properties that are not implemented. If signing is added, treat it as a new feature with a threat model, requirements, test vectors, accessibility review, and legal analysis. Existing digest comparisons can remain useful for change detection without being mislabeled as identity authentication.",
          ],
        },
        {
          title: "Rollback, Replay, and Competing Histories",
          paragraphs: [
            "A digest can detect that a current payload differs from a reference, but it cannot on its own establish which of two different payloads is newer. An attacker who can restore an older, internally consistent workspace and its matching digest may create a rollback that appears valid to a comparison limited to that local pair. Detecting rollback requires an independent monotonic reference, such as a trusted counter, externally witnessed checkpoint, or another party's authenticated record.",
            "Replay is related but distinct. A previously valid handover may be presented again in a new operational context. A verifier should bind a record to its purpose, parties, mission identifier, schema version, and intended sequence where appropriate. Those fields must themselves be included in the authenticated payload. Adding a display label outside the hashed selection does not prevent a valid old artifact from being relabeled.",
            "Forks occur when two parties continue from the same baseline but create different descendants. A local seal can show that each branch differs from its own reference; it cannot determine which branch has authority. A reconciliation process should preserve both versions, compare changed fields and supporting evidence, identify authorized decisions, and record the resolution. Never overwrite one branch merely because the other has a newer local timestamp.",
            "A central transparency log or shared registry can make forks more visible, but it adds governance, privacy, and availability questions. Decide who operates it, what is published, how inclusion proofs are checked, how equivocation is handled, and whether the log itself is independently monitored. A Merkle tree can efficiently prove inclusion or consistency when properly implemented, but no such property should be inferred from a local decision list that does not hash-link records.",
            "Operational tests should restore an older backup, duplicate a valid record, modify the mission identifier, and create two concurrent descendants. The expected behavior should be explicit: warn, block, request reconciliation, or accept with a documented exception. A visible divergence is often safer than automatic conflict resolution because the parties, not the serializer, have authority to decide which history governs.",
          ],
        },
        {
          title: "Retention, Privacy, and Evidence Governance",
          paragraphs: [
            "Integrity controls can conflict with data minimization. A digest of a low-entropy field may permit guessing: an observer can hash candidate values and compare them. A public digest can also reveal that two parties hold identical records or that a known template was used. Before externally publishing a digest, assess whether the underlying data is sensitive, whether the digest is linkable, and whether a keyed construction or access-controlled archive is more appropriate.",
            "Retention periods should be defined by the institution's records schedule, legal holds, mission requirements, and applicable law. Session-scoped browser storage may support temporary review but is not a durable archive. Conversely, a long-lived audit copy may preserve sensitive content beyond operational need. The custodian should know what is retained, where it is held, who can access it, how deletion is requested, and which metadata remains after content removal.",
            "A robust evidence package has more than one component: the original data object, its schema and canonicalization version, the digest or signature, provenance and authorization records, relevant source materials, and verification instructions. Store these components under a chain-of-custody procedure. A hash can detect changes to the object it covers, but cannot reconstruct missing context or prove that excluded attachments were present when the digest was made.",
            "Deletion also needs precise language. Removing a local storage entry is a logical operation in the browser API, not proof of physical overwrite of flash cells, backups, or operating-system snapshots. If preservation is required, panic cleanup and evidence retention may conflict. Define which response is authorized before an incident, who decides, and what minimal metadata can be preserved without exposing protected content.",
            "The legal custodian should be involved before a cryptographic handover becomes part of formal diplomacy. The system can produce a technical artifact; the institution must decide whether it is an official record, which language is authoritative, what constitutes approval, and how amendments are handled. This is especially important when multiple governments, archives, or legal systems have different retention and disclosure duties.",
          ],
        },
        {
          title: "A Layered Verification Procedure for Operational Use",
          paragraphs: [
            "Start by preserving the artifact as received and recording its transmission channel, sender identity, receipt time, and any accompanying signature or manifest. Avoid opening and resaving it in an editor before verification, since that can change serialization or metadata. Work on a copy in a controlled environment and keep the original read-only under the applicable evidence procedure.",
            "Next, identify the schema, canonicalization profile, selected payload, and algorithm. Confirm that the verifier implements that exact profile and that unknown fields are treated as specified. Reconstruct the payload from the artifact, canonicalize it, encode it as UTF-8, compute the digest, and compare the result. A mismatch should be reported as a mismatch, not repaired by normalizing or deleting fields until the digest agrees.",
            "If a signature is present, validate the signature over the specified bytes or digest and verify the certificate or public-key fingerprint against an independently trusted source. Check key purpose, authorization, validity period, revocation status, and any required countersignatures. If no signature exists, state plainly that the digest comparison does not authenticate the sender. A visual emblem or screenshot is not an equivalent cryptographic proof.",
            "Inspect semantic content only after technical integrity checks, and keep that review distinct. Confirm parties, languages, dates, mission context, attachments, and required approvals. Ask whether the signed or hashed payload includes all material the parties intended to bind. Consult legal authority about treaty authentication and consent; do not infer them from a successful algorithmic check.",
            "Finally, document the verifier's version, test vectors, output, assumptions, warnings, and custody actions. Preserve enough information for a second reviewer to repeat the procedure. If the record is disputed or the trust anchor is uncertain, quarantine it and escalate rather than marking it verified. An auditable process is valuable precisely because it can return 'unknown' without silently converting uncertainty into a green status.",
          ],
        },
        {
          title: "Schema Boundaries and Payload Selection",
          paragraphs: [
            "Canonicalization begins only after the record's scope is selected. If the application hashes a subset such as profile, binder, signals, and decisions, excluded fields remain outside the integrity claim even if they appear beside the digest in the user interface. A verifier must know the selection rule, not just the serializer. Otherwise two implementations can hash different semantic objects while each uses a perfectly consistent byte procedure.",
            "Payload selection should be explicit and versioned. Define required fields, optional fields, empty values, missing values, and whether unknown properties are rejected or ignored. A permissive verifier that drops unrecognized data can hide a meaningful change; a strict verifier may reject forward-compatible extensions. The protocol should choose deliberately and provide a migration path rather than relying on library defaults.",
            "Schema validation and canonicalization serve different purposes. A schema checks that an object has an expected shape and perhaps domain constraints; a canonicalizer maps a supported object to a deterministic representation. Neither establishes that the fields are true or authorized. Validate before canonicalizing, then bind the schema identifier and version to the digest input or authenticated envelope so a record cannot be reinterpreted under a different model without detection.",
            "The application helper's behavior for undefined values is a JavaScript boundary, not a feature of JSON itself. An undefined object property may be omitted by normalization, while an array position may become null under the helper's stated conversion. These distinctions can change list lengths or property presence. Test every such case, and prefer a clear schema-level representation of absence when records must travel across languages.",
            "Nested payloads, attachments, and external references need their own rules. A digest over a filename does not bind the contents of the named file. A digest over an array of attachments must define ordering and whether each attachment is separately hashed. Large files may be represented by content digests in a manifest, but the manifest and algorithm identifiers must then be included in the authenticated record. State precisely what is and is not covered.",
          ],
        },
        {
          title: "Adversarial Test Corpora and Metamorphic Properties",
          paragraphs: [
            "A compact example with three ordinary keys is not enough to validate a canonicalization protocol. Build a synthetic corpus containing nested objects, empty containers, repeated Unicode forms, escaped control characters, supplementary code points, negative zero, exponent notation, very large integers, fractional boundaries, sparse arrays, undefined values at JavaScript boundaries, and unsupported object types. Every case should have an expected outcome or an expected rejection.",
            "Known-answer SHA-256 vectors validate the cryptographic primitive independently of the payload logic. Then create end-to-end fixtures with expected selected object, canonical string, UTF-8 bytes, and digest. Keep the fixture generator separate from the implementation under test so it does not reproduce the same bug. Review the vectors and source them from a specification or independently checked tool.",
            "Metamorphic tests check properties that should remain true across controlled changes. Reordering object insertion should preserve output where the helper sorts keys; reordering a semantically ordered array should change output; adding an excluded field should not affect the selected payload; changing a covered scalar should change the canonical bytes. These tests are powerful because they explore relationships, but they still need fixed expected vectors to catch a shared mistaken assumption.",
            "Fuzzing can expose parser and serializer edge cases, but generated inputs should be bounded and reproducible. Save a failing seed and reduce the input to a minimal test case. Test cycles and unsupported values for explicit rejection rather than allowing a stack overflow or misleading digest. A robust verifier fails closed with a diagnostic; it should not silently convert errors into a valid-looking empty payload.",
            "Cross-language conformance testing should compare several independent implementations, but majority agreement is not a substitute for the protocol. When implementations disagree, identify the normative behavior and publish an erratum or new profile. Record implementation versions because runtimes and libraries evolve. A long-lived diplomatic record may need to remain verifiable decades later, so preserving vectors and a reference implementation is part of archival planning.",
          ],
        },
        {
          title: "Cryptographic Output and Side-Channel Considerations",
          paragraphs: [
            "A digest is deterministic: the same selected bytes produce the same output. That property supports comparison but creates linkability. Two observers who see the same digest can infer that they are looking at the same payload even without seeing its content. A changed digest can also signal that a negotiation record was revised. The timing, size, and frequency of seal operations may disclose operational patterns even if the record itself remains local.",
            "Low-entropy content is vulnerable to guessing when a digest is exposed. An adversary can enumerate plausible values, compute their hashes, and compare them. Adding a public fixed prefix does not prevent this. A keyed message authentication code or randomized construction may address some threat models, but each changes interoperability and requires secure key management; it cannot be introduced as an undocumented privacy tweak.",
            "Timing information needs careful interpretation. A local timestamp may help an operator organize work, but it does not provide trusted time if the device clock is uncontrolled. A remote timestamping authority can attest to a digest's existence by a time under a protocol, but contacting it exposes the digest and creates a third-party record. Consider whether the metadata itself is sensitive before selecting a time service.",
            "Side channels include more than network traffic. Screenshots, printouts, clipboard history, browser crash reports, debug logs, and support bundles can reveal the digest or context. A digest is generally less sensitive than the underlying record but is not automatically public. Apply classification, retention, access, and disclosure rules to it according to the possibility of inference and linkage.",
            "If an operational workflow must disclose a digest, define which fields it commits to and what an external party may infer. Use an authenticated channel for the reference, separate metadata from sensitive content where possible, and document who authorized publication. Do not promise confidentiality from a plain hash, and do not assume that a non-reversible function prevents all information leakage.",
          ],
        },
        {
          title: "Discrepancy Governance and Amendment Protocol",
          paragraphs: [
            "A digest mismatch is a finding, not a verdict about motive. The cause may be a substantive amendment, a serializer version difference, a stale profile, an encoding issue, an incomplete backup, or unauthorized modification. Begin by preserving both artifacts and the reference, then reproduce the comparison under the stated profile. Avoid assigning intent until the evidence supports it.",
            "The amendment protocol should distinguish draft, reviewed, approved, transmitted, and archived states. A local seal can mark a comparison point, but it should not silently promote a draft to an official instrument. Define which role may request a new baseline, which role approves it, and how the previous version is retained. If the seal is used for an operational assessment rather than a treaty text, name that scope clearly.",
            "Material corrections should be represented as amendments with rationale and authority, not as unexplained replacement. Preserve the prior version, record what changed, identify who approved the change, and link the new version to the old one through a trusted process. A decision ledger that is not cryptographically linked or independently anchored should not be described as tamper-proof history; its evidentiary value depends on storage and custody controls.",
            "When the parties disagree about a divergence, the technical team should not resolve the substantive question by choosing the newest file or the greenest display. Escalate to authorized negotiators and preserve dissent. A neutral technical reviewer can explain byte differences, serializer behavior, and test results, while the legal or diplomatic authority decides which text governs.",
            "After resolution, create a new record that binds the agreed content and its version, verify it independently, and document the trust anchor. Retain the discrepancy report under the records schedule. The process should make correction possible without erasing the fact that versions differed; integrity is not the same as freezing every draft forever.",
          ],
        },
        {
          title: "Collision Resistance and the Limits of Digest Uniqueness",
          paragraphs: [
            "A cryptographic digest has a fixed output size and therefore cannot be a mathematically unique name for every possible input. The security objective is that finding a practical collision or a second preimage is computationally infeasible for the selected algorithm and threat model, not that collisions are impossible. A SHA-256 match is strong evidence of byte equality under appropriate assumptions, but it is not a logical proof of uniqueness.",
            "Distinguish a collision, where two different inputs produce one digest, from a second-preimage attack, where an attacker seeks another input matching a particular existing digest. For a handover verification workflow, the second-preimage framing is often more relevant, though protocol weaknesses such as an unauthenticated reference or ambiguous payload selection may be easier avenues than attacking SHA-256 itself.",
            "Do not replace a sound algorithm with an ad hoc construction or assume that adding a filename makes the digest stronger. If domain separation is required, use a documented protocol that binds purpose and version to the input. Algorithm agility should be planned so a future migration can identify the old profile, verify legacy artifacts, and issue new references without silently rewriting history.",
            "Operational assurance should state its assumptions: correct implementation, correct input bytes, trustworthy reference, and acceptable algorithm status. Test the hash primitive against known-answer vectors and review the browser's Web Crypto implementation within supported platforms. The presence of a 64-character hexadecimal string alone does not demonstrate that the expected algorithm or payload was used.",
          ],
        },
        {
          title: "Independent Review and Long-Term Verifiability",
          paragraphs: [
            "A record expected to remain verifiable should preserve more than its digest. Retain the exact artifact, schema version, canonicalization profile, algorithm identifier, relevant test vectors, and verifier instructions. Keep a reference implementation or a reproducible specification under institutional custody. Without those materials, future archivists may be unable to distinguish a changed record from a changed serializer.",
            "Long-term verification also requires algorithm lifecycle planning. Monitor standards guidance, browser support, and new cryptanalytic results; define how to rehash or re-sign records when algorithms are deprecated. A new digest should be linked to the prior artifact and its custody history through an authenticated process. Rehashing does not retroactively strengthen the trustworthiness of a reference that was already compromised.",
            "A second reviewer should independently check payload selection, canonical text, encoded bytes, digest, and trust anchor. Avoid using the same library and assumptions for both production and verification without cross-checks. Document known differences, warnings, and excluded attachments. If the records cannot be verified under the available evidence, label that limitation rather than silently accepting a green result.",
          ],
        },
        {
          title: "Certificate Transparency as a Specialized Append-Only Log",
          paragraphs: [
            "RFC 9162 specifies Certificate Transparency version 2.0 for publicly logging the existence of TLS server certificates so that certificate authority activity can be audited and suspect issuance can be noticed. It is an experimental IETF protocol, not an Internet Standards Track specification, and its purpose is narrower than a general diplomatic records archive. The protocol is a useful case study in how commitments, proofs, and independent monitors can work together; it is not evidence that this application's local Decision Ledger uses those mechanisms.",
            "A Merkle tree organizes leaf entries and parent hashes so a log can commit to a particular ordered set of entries with a compact root. An inclusion proof allows a verifier to check that an entry is represented in a claimed tree. A consistency proof can support the claim that a later tree extends an earlier tree without rewriting its prior contents. These proofs depend on correctly specified tree construction, authenticated tree heads, verifier implementation, and a reliable way to obtain the proofs.",
            "Append-only structure is not the same as truth. A transparency log can accurately preserve a certificate entry that was submitted while saying nothing about whether the certificate's subject had legitimate authority or whether the underlying facts are true. Likewise, a diplomatic digest placed in a log would not establish consent, completeness, or legal effect. The log would answer a bounded history question, not validate the mission's claims.",
            "The public, multi-observer setting is central to Certificate Transparency's threat model. Monitors retrieve log data and look for entries that violate policy; clients and other participants can check signed tree heads and proofs. A private institutional log without independent monitors or a second trust path does not automatically gain the same detection properties just because it stores a Merkle root. The governance and observation model is part of the security design.",
            "This distinction matters when comparing RFC 9162 with the current seal. The UDCA computes a selected-payload digest and stores a local baseline in sessionStorage. The repository does not submit that value to a CT service, create Merkle inclusion proofs, publish signed tree heads, or gossip them to other monitors. It would be inaccurate to describe the seal as a transparency log, append-only public record, or externally witnessed commitment.",
            "An organization considering a transparency service should first identify the exact event to log, the observers allowed to query it, and the consequences of publishing an entry. Certificate Transparency logs public certificate artifacts for a defined ecosystem; a diplomatic record may contain sensitive timing, identities, or low-entropy values that should not be exposed. A mechanism suitable for public certificate accountability may be inappropriate for confidential negotiation records.",
          ],
        },
        {
          title: "Inclusion, Consistency, and Split-View Risk",
          paragraphs: [
            "An inclusion proof establishes a relationship between a candidate leaf, a tree position, and a claimed root according to the log protocol. It does not by itself prove that the log showed the same history to every observer. A malicious or faulty operator might present different signed tree heads to different clients. Detecting that split view requires parties to compare authenticated heads or use monitors and witnesses that can observe the log independently.",
            "A consistency proof is a statement about two tree sizes and their roots: it allows a verifier to test whether the later tree is consistent with the earlier one under the specified append-only construction. A verifier must check the proof correctly and preserve the earlier trusted checkpoint. If it accepts an untrusted initial root, a later proof cannot reconstruct the provenance of that first trust decision. The checkpoint's source and custody therefore remain essential.",
            "For a bilateral workflow, parties would need to agree on the log operator, public-key trust, proof retrieval, monitoring responsibility, response to an invalid proof, and a method for reconciling inconsistent views. They would also need to decide what an entry commits to, how a correction is represented, and whether a superseded record remains discoverable. These are policy and legal choices, not defaults supplied by the hashing algorithm.",
            "Privacy analysis should precede any commitment publication. A digest of a small set of possible values can be tested by guessing candidates. A timestamped sequence of entries can expose the rhythm of negotiations, even if names and text are omitted. An external observer may correlate the log with public events or counterpart communications. Salting or keyed constructions change the verification and distribution model, and a secret value can itself become a new custody burden.",
            "Operational tests should include more than a successful inclusion check. Verify deliberately malformed proofs, unknown tree sizes, stale heads, signature failures, delayed monitor observations, network partitions, and disagreement between independently obtained heads. Confirm that the interface reports 'not verified' or 'inconsistent view' rather than retaining a prior success state. Preserve the proof, signed head, retrieval time, verifier version, and trust-anchor source as part of the evidence record.",
            "Even with sound proofs, availability and recovery need attention. If the log is unavailable, an already-held tree head may still support some local checks, but new submissions or proofs may be delayed. If a signing key is compromised, the institution needs a policy for identifying the affected interval and replacing the trust anchor. If a log is discontinued, future verifiers need archived heads, proof material, and operator documentation. External append-only services create dependencies that must be governed and rehearsed.",
          ],
        },
        {
          title: "Signing Authority, Key Custody, and Delegation",
          paragraphs: [
            "A digital signature binds a verification result to a private-key operation; it does not, on its own, prove that a named official controlled the key or had authority to approve the record. A complete workflow must bind a public key to an identity, establish the delegation's scope and duration, and provide a way to assess key status at the relevant time. NIST SP 800-57 Part 1 gives general key-management guidance, but applying it does not resolve a ministry's legal authorization rules.",
            "Separate duties so one compromised account cannot silently create, approve, and archive a binding record. Depending on the threat model, enrollment, signing, key backup, revocation, and verification may belong to different roles. High-impact actions can require multiple approvals or a witnessed ceremony. The chosen design should remain operable during an emergency and should define how exceptions are recorded; a control that operators routinely bypass is not an effective assurance mechanism.",
            "Enrollment records should state who verified the key holder's identity, which authority approved the credential, what purposes are permitted, which devices or signing services may use it, and when it expires. A certificate path or key fingerprint helps a verifier identify a cryptographic key, but it does not substitute for the mission's delegation instrument. Preserve the authorization evidence separately from the signed payload and make the binding discoverable to an authorized verifier.",
            "Revocation and compromise procedures need an explicit time model. A key may be revoked after a device is lost, a private key is exposed, an official leaves office, or a delegation ends. The verifier then needs reliable evidence about when the signature was created and when the revocation became effective. A workstation's local timestamp is not sufficient to resolve a dispute about ordering; an approved trusted time or contemporaneous authenticated archive may be needed for that particular claim.",
            "Key backup trades availability against exposure. A lost key can make old signatures difficult to verify or new records impossible to sign, while an overly broad backup can create additional copies and holders. Define backup encryption, access approval, restore testing, dual control, audit, and destruction. Non-extractable browser keys are a property of the Web Crypto interface and do not establish that the operating system, browser, or account is immune to compromise.",
            "A key incident should not be handled by replacing the key and silently treating prior signatures as either valid or invalid. Preserve the affected key identifiers, authorization records, signature artifacts, incident timeline, and revocation evidence. Determine which records remain verifiable, which require corroboration, and what notice is due to recipients. Technical validation can report that a signature matches a key; an authorized institution must decide what that means for the record.",
          ],
        },
        {
          title: "A Verification Transcript That Can Be Repeated",
          paragraphs: [
            "A reliable verification record should let another reviewer reproduce each step without relying on a screenshot. Record the received artifact's exact bytes or a protected copy, its stated schema and canonicalization profile, the algorithm identifier, the signature or digest reference, and the source of the trust anchor. Include tool and version information, the verification date as observed by the verifier, warnings, and any unverified assumptions. Keep confidential payloads inside the approved records boundary.",
            "For a local digest comparison, capture the selected payload, canonical text or a protected representation of it, UTF-8 byte length, digest output, and baseline provenance where policy allows. For a signature workflow, include the signed bytes, signature format, public-key identifier, certificate or authorization evidence, status result, and any timestamp token. For a transparency-log workflow, include the entry, inclusion proof, signed tree head, consistency proof when relevant, and the independently trusted checkpoint.",
            "The transcript should distinguish mathematical outcomes from authority decisions. 'The digest matches the specified byte sequence' is a technical result. 'The signer was authorized for this act' is a conclusion that depends on credential and delegation evidence. 'This text is binding' is a legal conclusion under the applicable process. A combined report can present all three, but it should identify which reviewer or institution owns each judgment.",
            "Reproducibility requires preserving error states as well as success. A missing attachment, expired certificate, unavailable revocation source, unknown schema, or unsupported algorithm should produce an explicit limitation. Do not silently drop fields, coerce unknown values, or accept a stale green indicator. If a verifier cannot process an older profile, label the artifact unresolved and retain the original rather than modifying it until it passes.",
            "Use independent implementations for high-consequence verification where feasible, while recognizing that two implementations may share the same flawed specification or trust anchor. Compare payload bytes, not just UI labels. Validate each implementation against published test vectors and a local corpus that exercises edge cases. Keep the fixtures synthetic and ensure that test digests do not disclose guesses about actual low-entropy mission data.",
            "A transcript is itself a record with its own retention, access, and integrity requirements. Protect it from unauthorized alteration, link it to the artifact using an authenticated reference, and preserve the software and authority sources needed to interpret it. A well-documented transcript does not make the original assertion true, but it allows a future reviewer to understand what was checked, by whom, under which profile, and with what unresolved questions.",
          ],
        },
        {
          title: "Validating a Time-Stamp Token Without Overstating Its Meaning",
          paragraphs: [
            "RFC 3161 defines a request and response protocol between a requester and a Time-Stamping Authority. The requester can submit a message imprint rather than the underlying record, and the authority returns a token under its signing and operating policy. A verifier must check the token's cryptographic signature and the authority's certificate and policy context; merely receiving a signed object or displaying a date does not complete verification.",
            "The message imprint binds the token to a digest value and a named hash algorithm. A verifier should recompute the digest from the exact artifact and profile under review, then compare the result with the imprint. If the artifact is JSON, that comparison depends on agreed payload selection and canonicalization before hashing. A valid timestamp token attached to a digest of a different version or incomplete payload does not establish the time of the intended record.",
            "The token's time assertion is bounded by the authority's trust model and practice. Review the TSA identity, certificate chain, certificate status at the relevant time, stated policy, accuracy claims, and any request-response correlation required by the workflow. Preserve the request and response, not just an extracted timestamp. Where a nonce or other correlation value is used, verify it according to the agreed protocol so that a response cannot be casually confused with one issued for another request.",
            "A trusted timestamp can support a claim that the imprint was presented to the authority by a stated time. It does not show who authored the payload, whether the TSA saw the plaintext, whether the content was complete, or whether the underlying assertions were true. It also does not determine whether an official had authority to sign, whether a state consented to a treaty, or whether the record is admissible under a particular court's rules.",
            "External timestamping creates a data-disclosure decision even when only a digest is submitted. The digest can be linkable across submissions or susceptible to candidate guessing when the underlying data is predictable. Timing of a request can also reveal activity. Before using a TSA, obtain approval for the service, jurisdiction, retention, privacy impact, and algorithm profile. The convenience of an API does not authorize publication of operational metadata.",
            "If the service is unavailable, the application should not silently substitute the local device clock and label it trusted. Record the timestamp as unavailable, preserve the local time separately as an untrusted observation, and follow the approved fallback procedure. A later token can attest to the later submission time; it cannot retroactively prove the earlier local time unless the protocol and independent evidence support that conclusion.",
            "Long-term verification requires preserving the token, the relevant TSA certificate and status evidence, the artifact bytes, the canonicalization profile, and a verifier capable of interpreting the protocol. A token can remain mathematically verifiable while the institutional basis for trusting its signer changes. Archive the authority policy and time of validation alongside the result, and note later revocation or compromise findings rather than reducing verification to a permanent green check.",
          ],
        },
        {
          title: "Bilateral Receipts and Checkpoints Without Public Disclosure",
          paragraphs: [
            "A public transparency log is not the only way to reduce unilateral rollback risk. Two parties can exchange authenticated receipts for a defined artifact, maintain separately controlled archives, or agree that a neutral custodian holds a checkpoint. These options have different trust assumptions. A receipt proves only that the receiving party acknowledged a particular reference under the agreed identity and procedure; it does not prove that the content was true or that no other version existed.",
            "A bilateral receipt should identify the payload schema, canonicalization profile, hash algorithm, digest, document or mission identifier, and version purpose. It should also state whether the receiver confirms receipt, review, approval, or something narrower. Those verbs have different legal and operational meaning. Avoid an ambiguous 'accepted' marker when the party merely confirms that bytes arrived intact.",
            "Authenticate the exchange independently of the payload. A signed receipt can help bind an action to a key, but the parties still need a trustworthy identity-to-key relationship, current delegation, key lifecycle, and a way to resolve compromise. A receipt transmitted alongside the artifact through an unauthenticated channel can be replaced with it. Establish the trust path before the dispute rather than during it.",
            "An independently operated archive can preserve copies under separate access controls, but a second copy is not automatically independent. If both archives share a single administrator, identity provider, or backup account, their failure modes may be correlated. Map the custodians, encryption keys, recovery roles, physical and legal jurisdictions, and monitoring capabilities. The objective is not maximum duplication; it is a defensible separation matched to the risk.",
            "For a negotiated instrument, a checkpoint process can record successive drafts without asserting that every draft is final. Define how a new version supersedes, supplements, or corrects the former one; who authorizes each transition; and how translation variants and appendices are represented. Preserve earlier checkpoints under the retention schedule. This provides a transparent lineage while leaving interpretation and consent to the authorized diplomatic and legal process.",
            "A disagreement should trigger comparison and escalation, not automatic selection of the latest timestamp. Check each party's artifact, receipt, key evidence, canonical bytes, and any trusted time material. Identify whether the difference is substantive, representational, or caused by different profiles. If no independent reference resolves the conflict, record the uncertainty and seek an authorized determination. A new matching digest can establish a fresh checkpoint, but cannot settle disputed history.",
            "Before deployment, rehearse recipient turnover, lost keys, delayed delivery, archive outage, conflicting receipts, and a request to delete or correct a record. Define who can issue replacement credentials, how past signatures are assessed, and how both parties are notified of a superseding version. A process that works only while the original envoy and IT administrator remain available is not a robust custody arrangement.",
          ],
        },
        {
          title: "Governance of an External Log and Its Operators",
          paragraphs: [
            "A transparency log is a service with operators, software, signing keys, monitoring, retention rules, and an incident process. Before relying on it, define which organization runs the service, who can deploy changes, who can access its infrastructure, and how the log's public key is distributed to verifiers. A protocol specification describes message formats and operations; it does not select a trustworthy operator or determine which institution is accountable when the service fails.",
            "The log's entry policy must define accepted content, size, privacy review, rate limits, and correction handling. Certificate Transparency's intended object is the existence of TLS server certificates in a public ecosystem. A mission log would need its own rules for whether entries are public, pseudonymous, delayed, encrypted, or prohibited. Encrypting an entry while publishing its digest may still expose relationships or permit guessing, so classification must precede protocol design.",
            "Operational separation can reduce unilateral control. A log operator, a monitor, a witness, and a relying party can have distinct roles, but each must have access to enough authenticated information to detect a violation. If all monitors rely on one operator's feed or one signing key, their apparent independence may be weak. Document the communication paths, trust anchors, software versions, and expected monitoring frequency rather than describing the service as decentralized without evidence.",
            "Define how a signed tree head is produced, distributed, and retained, and what proof a client must obtain before treating an entry as included. Specify how stale heads are detected, what maximum delay is acceptable, and which independent party compares histories. A proof returned by the same endpoint that supplies an untrusted root does not independently establish that other clients received the same view. The verification design must include a trust source outside the claim being checked.",
            "A log incident can involve a signing-key compromise, inconsistent views, an unavailable service, a faulty update, or an inappropriate entry. The response plan should state how operators preserve the last trusted checkpoint, notify relying parties, investigate affected intervals, rotate keys, and publish corrective information. If a legal order requires disclosure or deletion, counsel must determine the response and how it interacts with the log's append-only properties and retention obligations.",
            "Service-level availability and data durability are separate from cryptographic integrity. A signed root may be valid even when clients cannot retrieve the associated entry or proof. Conversely, an accessible archive may have no independent integrity anchor. Set recovery objectives, backups, restore tests, and an archival process for proofs and tree heads. Rehearse migration to another operator without silently changing the meaning of historical references.",
            "Governance should include a process for reviewing the protocol's status and ecosystem. RFC 9162 is experimental, so an organization should not cite it as a universal standard or assume every client implements the same operations. Track relevant errata, implementation behavior, policy changes, and interoperability. If the deployment adapts the design, label the adaptation and test its security properties rather than implying full protocol conformance.",
            "Finally, make participation voluntary and authorized for sensitive records. A mission participant should understand what is submitted, who can observe it, how long it remains available, and what happens if a record is superseded. A public log can create durable exposure that cannot be undone by changing an application setting. Obtain approval from the data owner and counsel before logging a mission-derived commitment, and do not treat technical feasibility as institutional consent.",
          ],
        },
      ],
      statutoryRule: "Internal UDCA convention—not law: a local digest supports comparison of selected bytes under stated assumptions; it is not treaty authentication, ratification, or consent under the Vienna Convention on the Law of Treaties.",
    },
  ],
  practice: [
    {
      problem: "A Chancellery delegation on Desk 17 seals an active bilateral mission payload comprising three profile keys, three binder arrays, four signal variables, and two historical ledger events. The baseline SHA-256 seal digest is recorded as \\(D_{base}\\). During a confidential intermission, an unauthorized terminal user modifies the Interpersonal Bond score from \\(B_{inter} = 3.8\\) to \\(B_{inter} = 3.9\\), leaving all other parameters untouched. 1. Demonstrate the exact lexicographical key ordering of the canonical JSON payload across the profile and binder objects. 2. Explain why the live SHA-256 digest \\(D_{live}\\) diverges completely from \\(D_{base}\\) rather than exhibiting an incremental numerical shift. 3. Calculate the parameter-level divergence diff illuminated by the Divergence Beacon.",
      solution: [
        "1. Canonical Serialization Key Ordering: The local helper sorts enumerable object keys recursively using JavaScript's default string sort. For the supplied payload, root keys are binder, decisions, profile, and signals; profile keys are envoy, mandate, parties, sessionId, and theatre. Binder object keys are assumptions, exclusions, and facts. Array item order remains unchanged. Undefined object properties and function-valued properties are omitted, undefined or function array entries become null, and non-finite numbers become null. JSON.stringify supplies the final compact representation. These rules describe this helper, not a claim of full JCS conformance.",
        "2. SHA-256 Digest Change: The modification of \\(B_{inter}\\) from \\(3.8\\) to \\(3.9\\) changes the canonical input bytes. For an idealized hash, each output bit changes with probability \\(p = 0.5\\); this avalanche behavior is statistical, not a guarantee that every bit changes for every pair of inputs. Compare the full \\(D_{live}\\) with \\(D_{base}\\), but do not infer the size or location of an input change from digest proximity or claim that collisions are impossible.",
        "3. Divergence Inspection: The application can compare the baseline canonical string \\(D_{base}\\) with a current canonical payload \\(D_{live}\\) and present a structural difference at the relevant signal path, if that path is included by sealPayload. A difference report is application logic, not something SHA-256 computes. The displayed change is from \\(3.8\\) to \\(3.9\\), a numerical delta of \\(\\Delta = +0.1\\), assuming those values are present at that path in the actual payload. The UI can record a local seal-break event; that local ledger is not an immutable external evidence store.",
      ],
    },
    {
      problem: "Two implementations receive the same intended mission record. One constructs objects in the order `profile, binder, signals`; the other constructs them in the order `signals, profile, binder`. Both include an array of three decision records, one optional undefined property, and a non-finite numeric field. Explain what this repository's canonicalJson helper does, what a verifier must test for interoperability, and why the result should not be called RFC 8785 conformance without a complete standards comparison.",
      solution: [
        "The helper recursively copies object values into new objects whose Object.keys are sorted using JavaScript's default string sort. Therefore differing insertion order for ordinary string keys should not change the final canonical string. The helper maps finite numbers through unchanged, converts non-finite numbers to null, omits undefined and function-valued object members, and maps undefined or function-valued array entries to null. JSON.stringify then produces compact JSON. The decision array retains its order, so reversing those three records changes the representation because sequence is treated as meaningful.",
        "A cross-language verifier should not infer the result from this summary alone. It should use fixtures that expose property ordering, numeric serialization, Unicode, escaping, negative zero, undefined handling at the JavaScript boundary, and arrays. JSON has no undefined value, so the verifier must know whether its source object went through JavaScript normalization before JSON encoding. It should also reject cycles or unsupported structures clearly rather than silently substitute a value.",
        "RFC 8785 JCS specifies a particular input domain and serialization behavior, including the treatment of numbers and property sorting. The local helper shares the recursive sorting objective but has its own normalization rules, notably mapping non-finite values and unsupported members rather than requiring a JCS-compatible JSON input. Conformance requires comparing the complete behavior against the specification and its test vectors, not only observing that keys are sorted.",
        "The digest test should be layered. First compare the selected sealPayload object; next compare canonical text; then compare UTF-8 bytes; finally compare the 64-character digest against an independently computed SHA-256 test vector. A mismatch at each layer has a different cause. Keep the test data synthetic and avoid publishing a digest for sensitive low-entropy values, since a plain hash does not conceal candidate content.",
      ],
    },
    {
      problem: "A recipient receives a handover JSON file, its SHA-256 digest, and a screenshot showing that the local application displayed a green badge yesterday. The recipient asks whether the file is confidential, whether the screenshot proves the named envoy created it, whether the digest establishes its creation time, and whether the file binds the two states to a treaty. Provide a technical and legal answer and propose an appropriate verification procedure.",
      solution: [
        "A SHA-256 digest is not encryption, so it does not make the JSON file confidential. If the file itself is shared, its contents are readable unless a separate encryption layer protects them. A digest alone does not identify its author because anyone can calculate a digest for arbitrary bytes. A screenshot is easy to alter and generally does not bind the displayed badge to a cryptographically authenticated identity or to the exact file received.",
        "The digest indicates whether the recipient's selected byte representation matches the digest supplied, assuming the recipient uses the intended serialization and algorithm. However, if the file and digest arrived together through an untrusted channel, an attacker could replace both. A trusted signature over the digest and schema identifier, validated against an authorized public key, would provide stronger evidence of origin. Key authorization, certificate status, delegation, and revocation procedures remain essential.",
        "The screenshot's date is not a trusted timestamp. A local clock can be wrong and an image can be created later. A trusted timestamp authority or independently witnessed publication could attest that a digest existed by a stated time, but the authority's identity, protocol, and legal relevance would need review. The date still would not prove when the underlying events occurred or that their assertions were true.",
        "Treaty consent is a separate question. A local application seal is not automatically authentication of a treaty text, consent to be bound, or ratification under domestic constitutional rules. Verify the canonical payload and digest with an agreed implementation; validate any digital signature and key authorization; inspect the signed schema and version; then assess treaty form, authorized signatories, language versions, and consent under applicable law. Preserve the verification record and its custody separately from the analytical UI.",
      ],
    },
    {
      problem: "A local Handover Seal has been generated. Later, the browser profile is restored from backup and the seal appears green, but the operator cannot establish whether the baseline and signal state were restored from the same point in time. Specify the integrity questions, the records needed to resolve them, and a safe response if the state cannot be independently verified.",
      solution: [
        "A green local comparison means the current selected payload matches the stored reference being compared. It does not establish that both were restored from the same point in time, that the baseline was not replaced, or that the backup captured a coherent transaction. The first question is whether the restore process copied profile, binder, signal state, decisions, and seal atomically or may have mixed revisions.",
        "Inspect backup metadata, application release and schema version, seal creation time and identity fields, saved workspace revision, and decision records around the seal and restore. Timestamps from a device-local clock are useful context but not trusted time evidence. Determine whether the payload canonical string is available and whether it recomputes to the stored digest. If an independent signed or externally archived digest exists, verify against that separate anchor.",
        "If the state is internally consistent but its provenance cannot be established, do not call it independently authenticated. Preserve a copy under the applicable evidence-handling policy, record the uncertainty, and compare it with another party's authorized copy or a known-good backup. Avoid resealing immediately if that would obscure the distinction between the restored baseline and the current state; first capture the discrepancy and the operator's rationale.",
        "If independent verification is not possible, treat the handover as unverified, re-enter or recover data through an authorized process, and obtain a fresh seal only after the payload and provenance are reviewed. A new local digest can establish a new comparison point, not repair the missing history. If the record is legally significant, involve the records officer or counsel and use the approved signature, archive, or timestamp process.",
      ],
    },
    {
      problem: "Two negotiating teams exchange JSON handovers and report different SHA-256 digests even though both documents appear identical in a text editor. Design a diagnostic sequence that identifies whether the discrepancy arises from payload selection, canonicalization, encoding, hashing, or an unauthenticated reference. Explain what the teams should preserve while investigating.",
      solution: [
        "Preserve each received file byte-for-byte, the accompanying digest, transmission metadata, schema/version identifiers, and any signature or manifest. Do not edit either file to make it look uniform. Record the verifier build and environment so the test itself can be repeated. The visible editor rendering is not sufficient because whitespace, escaped characters, line endings, invisible Unicode code points, and excluded fields may differ while the display appears the same.",
        "Compare the selected payload first. Determine which properties the seal includes and whether one producer omitted a field or included an extra one. Then compare the normalized object model and canonical JSON text using the agreed profile. Inspect object-key order, array sequence, undefined or non-finite handling before JSON serialization, numeric formatting, escaping, and Unicode normalization. Treat any undocumented divergence as a protocol defect, not as permission to guess.",
        "If canonical strings match, compare UTF-8 byte arrays and byte lengths. If those match but computed digests differ, verify that both sides actually used SHA-256 and the same byte sequence, then test each implementation against published known-answer vectors. If the local digests match but the exchanged expected value does not, examine whether that reference was altered or associated with another record.",
        "A matching digest supplied alongside the file through the same unauthenticated channel is not an independent trust anchor. Verify a sender signature, a separately authenticated reference, or a bilateral record from an approved archive. Until the source is established, describe the result as a technical comparison only. Do not infer which team's document is authoritative from a digest mismatch.",
        "Once the cause is understood, document it, retain both versions, and agree on a canonicalization profile and migration procedure before resealing. If the difference reflects substantive content, refer it to authorized negotiators rather than normalizing it away. If it is purely representational, establish a new verified artifact with an explicit version and preserve the original inputs and diagnostic report.",
      ],
    },
    {
      problem: "A mission office proposes publishing a digest of a confidential handover in a public transparency log to prevent later rollback. Evaluate the confidentiality, linkability, rollback, and governance consequences, and recommend a narrower control if public publication is not approved.",
      solution: [
        "A digest is not encryption, and a public digest can leak information even if it does not reveal the full document. If an attacker can guess a low-entropy field or template, they can hash candidates and compare. Repeated digests can reveal that two offices hold the same payload, while timing and inclusion metadata can reveal when a negotiation artifact was created or amended. Assess these risks against the sensitivity and likely adversaries.",
        "An append-only transparency log may help expose later equivocation or rollback if it has sound inclusion and consistency proofs, independent monitors, and agreed rules. It does not prove that the logged object was true, authorized, or legally binding. A compromised log operator, split views, missing monitor, or unverified client can undermine the assurance. Specify who operates the service, how clients detect inconsistent histories, and how records are removed or retained under law.",
        "If publication is not acceptable, use a protected bilateral archive, separately authenticated exchange of checkpoints, or independent custodian under an agreed protocol. A keyed digest may reduce offline guessing but introduces key distribution and custody responsibilities. A digital signature can establish key-based origin under a validated authorization framework, though it still exposes the signed artifact if published and does not provide confidentiality.",
        "Choose the control based on the threat model. If the main concern is accidental local rollback, a separately stored, access-controlled checkpoint with an accountable custodian may be proportionate. If the concern is one party presenting inconsistent histories, bilateral signed receipts or a mutually governed log may be warranted. Document residual privacy and availability risks in either case.",
        "Before deployment, run a tabletop exercise covering key loss, log outage, public disclosure, mismatched checkpoints, and a request to delete data. Establish a process for preserving evidence without making confidential content public. The parties' authorized officers and legal counsel should approve the trust model; a software team should not publish mission-derived digests solely because the API makes it easy.",
      ],
    },
    {
      problem: "A receiving office verifies a handover digest successfully but discovers that an attachment named in the JSON record is missing. The sender argues that the green digest proves the attachment was present. Explain the scope error and prescribe a corrected manifest and custody procedure.",
      solution: [
        "A successful digest comparison proves only that the selected payload bytes match the reference under the agreed canonicalization and hash procedure. If the payload contains an attachment filename but not the attachment's bytes or digest, the seal does not establish that the referenced file was present, unchanged, or even accessible when the handover was created. A label is not a cryptographic commitment to the labeled object.",
        "Preserve the received JSON, digest, transmission record, and any files that did arrive. Record the missing attachment as a discrepancy. Do not insert a replacement and reseal before determining whether the original file exists in an authorized source or archive. The sender's statement can be retained as a claim, but it is not evidence that the object was included.",
        "A corrected manifest should identify each attachment with a stable logical name, media type, byte length, version, and digest over its exact file bytes using an explicitly named algorithm. The manifest itself should be included in the canonical handover payload or authenticated envelope. Where attachments are ordered, define and preserve that order; where not, define a normalization rule.",
        "Use an authenticated transfer and custody process for both the manifest and the files. A recipient should verify each file digest independently, confirm the manifest signature or reference through a trusted channel, and record receipt status. If confidential attachments are too sensitive for an external log, retain the manifest in the same protected archive rather than publishing its digests without privacy review.",
        "If the missing material affects legal interpretation or operational decisions, the record remains incomplete even if its JSON digest is valid. Obtain direction from the authorized parties, document the gap, and issue a new handover only after the attachment set and approvals are confirmed. The technical verifier should report integrity separately from completeness and legal effect.",
      ],
    },
    {
      problem: "A multilingual draft has two visually identical strings for a party name, but one uses a composed character and the other a base character plus a combining mark. A local field sanitizer normalizes on blur. Explain how the strings may compare before and after that event, which exact value belongs in the seal, and what an independent verifier must not do.",
      solution: [
        "Unicode permits sequences that render identically while containing different code points. Before the sanitizer runs, the composed and decomposed strings can produce different UTF-8 bytes and therefore different canonical JSON and SHA-256 digests. If the field is normalized to NFC on blur, the stored value may become the normalized sequence; the seal should hash the actual stored record selected at seal time.",
        "The verifier must not normalize arbitrary received text merely to make a digest match. That could conceal a change in the record and would not reproduce the original bytes. The agreed protocol should specify whether normalization occurs at field-entry time, during payload construction, or not at all. The current helper does not establish a general Unicode normalization policy simply because other input fields may be sanitized.",
        "Preserve the original artifact and metadata, identify the schema and field handling policy, and compare the exact code-point sequence as received. If a valid pre-seal blur event normalized the value, verify that event through the application record or trusted workflow evidence where available. Do not rely solely on a visual editor because rendering may hide the difference.",
        "Multilingual legal review remains necessary. NFC equivalence is a technical normalization property, not a decision about transliteration, legal identity, translation authority, or treaty meaning. Confirm that the name is represented in the correct language and script and that an authorized reviewer approves it.",
        "The final verification report should record the normalization profile and exact payload bytes. If two parties used incompatible profiles, treat that as a protocol mismatch, retain both versions, and agree on a new profile before resealing. Do not silently rewrite an already received record.",
      ],
    },
    {
      problem: "A local handover has a valid SHA-256 digest and an attached digital signature. The public key belongs to a former envoy whose delegation ended last month, and the receiving team cannot determine whether authority had been revoked when the signature was made. State what the cryptographic check establishes and what additional evidence is needed.",
      solution: [
        "Successful signature verification establishes that the signature is mathematically consistent with the message and the corresponding public key under the selected algorithm, assuming the verifier and key are correct. It does not by itself establish the signer's current or historical authority, the scope of delegation, or whether the private key was compromised.",
        "The team needs an independently trusted identity-to-key binding, the delegation instrument and its effective dates, the mission-specific authorization scope, and the revocation or suspension record. It should also establish when the signature was made through a trusted timestamp or contemporaneous authenticated archive if timing is material. A timestamp displayed by the local workstation is not enough.",
        "Check whether the signing key was valid for the relevant purpose, whether the signature covered the correct canonical bytes and schema identifier, and whether required countersignatures or procedural approvals exist. Preserve the original signed file, certificate or public-key fingerprint, verification output, and source of revocation information.",
        "If the historical status cannot be established, report the signature as cryptographically valid but authority-unverified. Do not describe the handover as approved merely because the public key verifies. Escalate to the office responsible for credentials and delegation records, and obtain confirmation from an authorized successor or archive.",
        "A corrected approval should follow the institution's process and preserve the original artifact and uncertainty. Re-signing a modified payload does not retroactively resolve who had authority at the earlier time; it creates a new act that should be described as such.",
      ],
    },
    {
      problem: "A software team changes the serializer so that it omits empty arrays and converts all strings to NFC before hashing. Existing stored seals now show divergence even though operators report no substantive edits. Prepare a migration and communication plan that preserves auditability and avoids masking changes.",
      solution: [
        "Treat the change as a protocol-version change, not a harmless refactor. Omitting empty arrays changes the payload model, and NFC normalization changes string bytes. Existing seals were computed under the prior behavior; comparing their digests directly with outputs from the new serializer is not a valid test of whether an operator edited the record.",
        "Preserve the old serializer or a reference implementation, retain the original seal records and application versions, and create compatibility fixtures from representative synthetic data. Verify that the old version reproduces old canonical strings and digests, then separately test the new profile. Document which historical records remain verifiable under each version.",
        "Do not automatically reseal all workspaces. First compare old and new selected payloads field by field, classify representation-only changes and substantive differences, and obtain approval from the records custodian. Any migration should retain the original bytes, old digest, new digest, transformation description, tool version, and authorizing decision.",
        "Communicate to operators that a divergence after upgrade may reflect the new serialization profile rather than a user action, but do not assume that is the cause without comparison. Provide a clear verification status that distinguishes legacy-profile, migrated, and unresolved records. Avoid a green status that conceals the historical change.",
        "Update the protocol documentation, independent verifier, test vectors, and release notes together. If another party needs to verify the record, coordinate the profile and migration before exchanging new digests. The change should be reviewed for legal record-retention and language-normalization implications as well as software compatibility.",
      ],
    },
    {
      problem: "A reviewer claims that a matching SHA-256 digest proves an artifact is unique, authentic, and true because no collision has been observed in the test suite. Correct the reasoning and provide a more defensible assurance statement.",
      solution: [
        "A finite digest cannot uniquely identify every possible input in the mathematical sense, and a test suite cannot prove that collisions are impossible. SHA-256 is designed so practical collision and second-preimage attacks are infeasible under current assumptions, but the relevant claim is computational security, not absolute uniqueness.",
        "A matching digest compares a selected representation with a reference only if both parties use the same payload selection, canonicalization profile, encoding, and algorithm. If the reference was changed alongside the artifact, or if important attachments were excluded, the comparison does not provide the asserted assurance.",
        "A plain digest does not authenticate the author, because anyone can compute it. Origin assurance requires an authenticated trust anchor, such as a properly authorized digital signature or independently controlled reference. Even a verified signature does not establish that the assertions are factually true or that the signer had legal authority for every purpose.",
        "A defensible statement is: 'The received payload produces the same SHA-256 digest as the independently obtained reference under canonicalization profile X and verifier version Y. This supports byte-integrity comparison for the selected payload. It does not by itself establish author identity, completeness, trusted time, factual truth, or legal effect.'",
        "The report should identify the reference source, protocol version, exclusions, test vectors, and any signature or authorization checks. Preserve the artifact and verification record so a second reviewer can reproduce the result. If the reference or authority is uncertain, report the status as unverified rather than treating a matching local display as proof.",
      ],
    },
    {
      problem: "An archive officer receives a sealed payload whose JSON contains a decision record, but the officer cannot determine whether the decision array order is chronological or merely presentational. Explain why this matters to the digest and how the archive should resolve the semantic ambiguity.",
      solution: [
        "The current canonicalization helper preserves array order. Reordering the decision array changes the JSON text and ordinarily changes its digest, even if a human regards the entries as the same set. The digest therefore commits to sequence at the representation level, but that behavior alone does not establish that the sequence means chronology.",
        "Inspect the schema, producer code, and documentation for the array's semantics. Determine whether entries carry explicit timestamps or sequence identifiers, whether those values are trustworthy, and whether the array order is guaranteed by the application. Do not infer chronology solely from display order unless the protocol defines it.",
        "If order is semantically meaningful, preserve it and verify any associated sequence constraints. If order is not meaningful, a future profile may define a deterministic ordering, but it must specify a stable comparator and migration version. Do not reorder an existing sealed record after the fact to make digests agree.",
        "Preserve the received artifact, document the unresolved interpretation, and seek confirmation from the record owner or authorized custodian. An archive can validate that bytes match a reference while separately marking the array's semantics as unknown. That distinction prevents representation integrity from being mistaken for evidentiary chronology.",
        "Any schema change should include test fixtures for ordered and unordered collections, export behavior, and cross-language verification. The application and archival policy should use clear terms such as sequence, set, or display grouping rather than a generic label like 'events.'",
      ],
    },
  ],
  readingList: [
    {
      citation: "Rundgren, A., Jordan, B., & Erdtman, S. (2020). RFC 8785: JSON Canonicalization Scheme (JCS). Internet Engineering Task Force (IETF).",
      url: "https://www.rfc-editor.org/rfc/rfc8785",
      note: "An informational IETF RFC specifying the JSON Canonicalization Scheme; it is a useful reference, but this application's helper is not claimed to be fully JCS-conformant.",
    },
    {
      citation: "National Institute of Standards and Technology (NIST). (2015). FIPS PUB 180-4: Secure Hash Standard (SHS). U.S. Department of Commerce.",
      url: "https://doi.org/10.6028/NIST.FIPS.180-4",
      note: "Defines the mathematical architecture, padding schemes, compression functions, and security bounds of the SHA-256 cryptographic algorithm.",
    },
    {
      citation: "United Nations. (1969). Vienna Convention on the Law of Treaties (VCLT), Articles 26, 31-33. Treaty Series, vol. 1155, p. 331.",
      url: "https://treaties.un.org/pages/ViewDetailsIII.aspx?src=TREATY&mtdsg_no=XXIII-1&chapter=23",
      note: "Codifies the customary international law governing pacta sunt servanda, treaty interpretation, and the legal status of multi-lingual and authenticated texts.",
    },
    {
      citation: "Diffie, W., & Hellman, M. (1976). New directions in cryptography. IEEE Transactions on Information Theory, 22(6), 644-654.",
      url: "https://doi.org/10.1109/TIT.1976.1055638",
      note: "The seminal paper introducing public-key cryptography, digital signatures, and the theoretical foundation of computational authentication.",
    },
    {
      citation: "Bray, T. (2017). RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format.",
      url: "https://www.rfc-editor.org/rfc/rfc8259",
      note: "Internet Standard describing JSON syntax, object semantics, numbers, strings, and interoperability considerations.",
    },
    {
      citation: "W3C. Web Cryptography API, Level 2.",
      url: "https://www.w3.org/TR/webcrypto-2/",
      note: "Current W3C working draft describing browser cryptographic interfaces; its status is a draft and should be cited as such.",
    },
    {
      citation: "WHATWG. HTML Standard, Web Storage.",
      url: "https://html.spec.whatwg.org/multipage/webstorage.html",
      note: "Normative reference for sessionStorage scope and behavior; tab-session storage is not a guarantee of RAM-only persistence.",
    },
    {
      citation: "Unicode Consortium. Unicode Standard Annex #15: Unicode Normalization Forms.",
      url: "https://www.unicode.org/reports/tr15/",
      note: "Defines Unicode normalization forms, including NFC; useful for distinguishing canonical equivalence from security sanitization.",
    },
    {
      citation: "National Institute of Standards and Technology. SP 800-107 Rev. 1: Recommendation for Applications Using Approved Hash Algorithms.",
      url: "https://doi.org/10.6028/NIST.SP.800-107r1",
      note: "Application-level guidance on using hash functions and their security strengths.",
    },
    {
      citation: "NIST. SP 800-57 Part 1 Rev. 5: Recommendation for Key Management.",
      url: "https://doi.org/10.6028/NIST.SP.800-57pt1r5",
      note: "Key-management guidance relevant to signatures, key custody, protection, and lifecycle claims.",
    },
    {
      citation: "U.S. Department of State. (1994, October 21). Agreed Framework between the United States of America and the Democratic People's Republic of Korea.",
      url: "https://2001-2009.state.gov/t/ac/rls/or/2004/31012.htm",
      note: "The agreement text used here for its reciprocal commitments, safeguards language, and sequencing; it is not evidence that a digest would have resolved implementation disputes.",
    },
    {
      citation: "Organization for Security and Co-operation in Europe. (2015, February 12). Package of Measures for the Implementation of the Minsk Agreements.",
      url: "https://www.osce.org/cio/140156",
      note: "OSCE-hosted primary text of the package (Russian-language version); used for the stated scope of measures. Any English rendering should be cross-checked against an agreed translation; this source does not establish why implementation later failed.",
    },
    {
      citation: "Adams, C., Cain, P., Pinkas, D., & Zuccherato, R. (2001). RFC 3161: Internet X.509 Public Key Infrastructure Time-Stamp Protocol (TSP). IETF.",
      url: "https://www.rfc-editor.org/rfc/rfc3161",
      note: "Protocol specification for trusted timestamping; a timestamp token can attest to a presented digest under its trust model but not establish the underlying statement's truth.",
    },
    {
      citation: "Laurie, B., Messeri, E., & Stradling, R. (2021). RFC 9162: Certificate Transparency Version 2.0. Internet Engineering Task Force.",
      url: "https://www.rfc-editor.org/rfc/rfc9162",
      note: "Experimental protocol for publicly logging TLS server certificates; used as a bounded comparison for Merkle inclusion and consistency proofs, not as a description of the UDCA ledger.",
    },
    {
      citation: "National Institute of Standards and Technology. (2023). FIPS PUB 186-5: Digital Signature Standard (DSS).",
      url: "https://doi.org/10.6028/NIST.FIPS.186-5",
      note: "Primary standard for digital signature algorithms; signature validation remains distinct from verifying a signer's authority or the factual accuracy of signed content.",
    },
    {
      citation: "Vinculum Security Website source: src/components/desk/registry.ts, canonicalJson and apostilleBody.",
      note: "Primary implementation reference for recursive object-key sorting, undefined and function handling, non-finite numeric mapping, and final JSON.stringify behavior.",
    },
    {
      citation: "Vinculum Security Website source: src/components/desk/handoverSeal.ts.",
      note: "Primary implementation reference for the selected seal payload, sessionStorage record, digest computation, comparison, and local decision-log events.",
    },
    {
      citation: "Vinculum Security Website source: src/lib/chancelleryCrypto.ts.",
      note: "Primary implementation reference for UTF-8 SHA-256 helpers, constant-time digest comparison, cryptographic operations, and the limited scope of buffer overwriting.",
    },
    {
      citation: "Vinculum Security Website source: src/components/desk/ledgerStore.ts.",
      note: "Primary implementation reference for the local decision ledger; read it directly before making any claim that it is append-only, externally anchored, or a hash chain.",
    },
  ],
  quiz: [
    {
      id: "q3-2-1",
      question: "Why does a portable cryptographic workflow need a precisely defined JSON-to-bytes procedure?",
      options: [
        {
          id: "q3-2-1-opt-a",
          text: "Because standard JSON cannot encode numbers containing decimal points.",
          explanation: "Incorrect. Standard JSON natively supports floating-point decimals.",
          correct: false,
        },
        {
          id: "q3-2-1-opt-b",
          text: "Because equivalent data may be represented with different member order or formatting, and a digest compares bytes rather than abstract JSON meaning.",
          explanation: "Correct. A cross-runtime verifier needs the same defined serialization, not an assumption that all producers emit identical bytes.",
          correct: true,
        },
        {
          id: "q3-2-1-opt-c",
          text: "Because JSON serialization automatically encrypts data using an unshared private key.",
          explanation: "Incorrect. Serialization is plain-text formatting, not encryption.",
          correct: false,
        },
        {
          id: "q3-2-1-opt-d",
          text: "Because international law requires all diplomatic accords to be formatted exclusively in XML.",
          explanation: "Incorrect. International law specifies no technical file format for internal working records.",
          correct: false,
        },
      ],
    },
    {
      id: "q3-2-2",
      question: "What is the consequence of modifying a single bond score from 3.8 to 3.9 after a Handover Seal has been established on Desk 17?",
      options: [
        {
          id: "q3-2-2-opt-a",
          text: "The seal hash increases numerically by exactly 0.1 hex units.",
          explanation: "Incorrect. Cryptographic hash functions do not preserve mathematical proportionality.",
          correct: false,
        },
        {
          id: "q3-2-2-opt-b",
          text: "The system automatically rounds the score back down to 3.8 to preserve hash equality.",
          explanation: "Incorrect. The system never forcibly mutates operator inputs to hide divergences.",
          correct: false,
        },
        {
          id: "q3-2-2-opt-c",
          text: "The digest will ordinarily differ; the application can then compare canonical payloads to identify the changed field, subject to the stored baseline and implementation being trustworthy.",
          explanation: "Correct. SHA-256 provides a compact comparison, while the structural diff—not the digest itself—can identify a changed parameter.",
          correct: true,
        },
        {
          id: "q3-2-2-opt-d",
          text: "The entire application crashes and erases all historical missions from disk.",
          explanation: "Incorrect. Divergence is a normal evidentiary detection state, not an unhandled runtime error.",
          correct: false,
        },
      ],
    },
    {
      id: "q3-2-3",
      question: "In this application, what does a verified Handover Seal technically establish?",
      options: [
        {
          id: "q3-2-3-opt-a",
          text: "It legally binds all participating sovereign states under Article 14 of the Vienna Convention on the Law of Treaties.",
          explanation: "Incorrect. Cryptographic seals are technical instruments of custody; legal ratification requires constitutional state processes.",
          correct: false,
        },
        {
          id: "q3-2-3-opt-b",
          text: "It proves that the underlying economic and military intelligence in the mission binder is objectively true.",
          explanation: "Incorrect. Cryptography verifies data immutability and custody, not empirical veracity.",
          correct: false,
        },
        {
          id: "q3-2-3-opt-c",
          text: "It records a digest for the selected payload so the application can compare later canonical content with that baseline; it does not independently authenticate who sealed it or prove the payload's truth.",
          explanation: "Correct. The local SHA-256 seal is an integrity checkpoint under stated storage and code assumptions, not a signature, factual validation, or ratification.",
          correct: true,
        },
        {
          id: "q3-2-3-opt-d",
          text: "It grants the diplomatic envoy absolute sovereign immunity in foreign domestic courts.",
          explanation: "Incorrect. Diplomatic immunity derives from international treaties, not local cryptographic software.",
          correct: false,
        },
      ],
    },
    {
      id: "q3-2-4",
      question: "Why should the repository's canonicalJson helper not be described as fully conforming to RFC 8785 without additional conformance testing?",
      options: [
        {
          id: "q3-2-4-opt-a",
          text: "Because RFC 8785 prohibits hashing JSON in browser applications.",
          explanation: "Incorrect. JCS is designed to provide a canonical representation for cryptographic operations.",
          correct: false,
        },
        {
          id: "q3-2-4-opt-b",
          text: "Because the helper has defined handling for undefined values and non-finite numbers and uses JavaScript sorting, so its full behavior must be compared against JCS requirements rather than inferred from recursive key sorting alone.",
          explanation: "Correct. Similar design goals do not establish standard conformance; edge-case behavior and the complete serialization rules must be tested.",
          correct: true,
        },
        {
          id: "q3-2-4-opt-c",
          text: "Because SHA-256 automatically removes whitespace and sorts object keys before hashing.",
          explanation: "Incorrect. Hash functions receive bytes and have no JSON awareness.",
          correct: false,
        },
        {
          id: "q3-2-4-opt-d",
          text: "Because JSON objects have a required semantic order that cannot be changed.",
          explanation: "Incorrect. JSON object member order is not a semantic ordering rule; arrays are ordered sequences.",
          correct: false,
        },
      ],
    },
  ],
};
