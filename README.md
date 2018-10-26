[![Build Status](https://travis-ci.org/furkleindustries/ifid.svg?branch=master)](https://travis-ci.org/furkleindustries/ifid)

# ifid

## Summary

An Interactive Fiction Identifier (IFID) generating class and helper functions. Implements both RFC 4122 UUIDs (versions 1 and 4), as well as essentially all of the Treaty of Babel, revision 9, as it applies to IFIDs. This package relies on the [big-uuid](https://github.com/furkleindustries/big-uuid) package for its generation of v1 and v4 UUIDs.

## Usage notes

* Many of the generation methods utilize MD5. This is for historical compatibility with many aspects of the Treaty of Babel. However, MD5 has since proven to be dangerously inadequate as a hashing algorithm, and extreme caution should be taken by anyone intending to use it to create a permanently unique identifier.
* UUID v3 and v5 have been omitted from the IFID generator. If you want to generate these IDs, use [big-uuid](https://github.com/furkleindustries/big-uuid) directly.
