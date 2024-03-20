# Islet Fork for Atlanticode

This repository contains a fork of the opensource [Islet project](https://github.com/dkales/islet) that has been modified to work with the Atlanticode application. Islet is a framework for building confidential computing applications using Intel SGX and ARM TrustZone with great contributions to the confidential computing space.

## Modifications

The following modifications have been made to the Islet codebase to integrate it with Atlanticode:

1.⁠ ⁠*Exception Handler Fix*: The exception handler has been updated to store and resume additional registers, including NEON registers, to prevent context loss during exception handling. This fix ensures proper execution resumption after exceptions occur.

2.⁠ ⁠*Page Table Updates*: Page table updates have been accompanied by the necessary TLB and cache invalidation operations to maintain consistency and avoid potential issues.

3.⁠ ⁠*Dependency Updates*: The ⁠ half ⁠ crate dependency has been updated to support NEON instructions. However, to minimize the cost of storing NEON context during exception handling, the usage of NEON instructions has been limited to only the required operations, and exceptions are prevented during those operations.

4.⁠ ⁠*DABT Handling*: In the case of DABT (Data Abort) exceptions with page faults taken from the same exception level (EL2 in Realm World), the ⁠ ELR_EL2 ⁠ register is not incremented for execution resume. Instead, the instruction that caused the failure is executed again.

## Usage
Go into the docker terminal, uncompress the attached data.zip, and copy the uncompressed files to `/islet/examples/confidential-ml/certifier-data/` (overwrite)
Edit `/islet/third-party/certifier/src/cc_helpers.c` as follows.
```
void secure_authenticated_channel::server_channel_accept_and_auth(
      void (*func)(secure_authenticated_channel&)) {
    // accept and carry out auth
+  SSL_CTX_set_verify(SSL_get_SSL_CTX(ssl_), SSL_VERIFY_PEER, NULL);
    int res = SSL_accept(ssl_);
}
```

## Acknowledgements

We would like to express our gratitude to the Islet project and its contributors for their excellent work in the field of confidential computing. Their efforts have provided a solid foundation for building secure and privacy-preserving applications.

## License

This fork of Islet is released under the same license as the original Islet project. Please refer to the [Islet License](https://github.com/dkales/islet/blob/main/LICENSE) for more information.

## Contact

If you have any questions, issues, or suggestions regarding this fork of Islet or its integration with Atlanticode, please contact our team at [support@atlanticode.dev](mailto:support@atlanticode.dev).