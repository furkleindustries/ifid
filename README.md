[![Build Status](https://travis-ci.org/furkleindustries/ifid.svg?branch=master)](https://travis-ci.org/furkleindustries/ifid)

# IFID

## Summary

An Interactive Fiction Identifier (IFID) generating class and helper functions. Implements both RFC 4112 UUIDs (versions 1 and 4), as well as essentially all of the Treaty of Babel, revision 9, as it applies to IFIDs.

## Usage notes

* A good deal of the generation methods (in particular UUIDv1, UUIDv3, and all the file-based and MD5 Treaty of Babel methods) will not work well, or at all, in the browser.
* Many of the generation methods utilize MD5. This is for historical compatibility with many aspects of the Treaty of Babel. However, MD5 has since proven to be dangerously inadequate as a hashing algorithm, and extreme caution should be taken by anyone intending to use it to create a permanently unique identifier.