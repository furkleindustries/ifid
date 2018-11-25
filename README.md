[![Build Status](https://travis-ci.org/furkleindustries/ifid.svg?branch=master)](https://travis-ci.org/furkleindustries/ifid)
[![Code coverage](https://codecov.io/gh/furkleindustries/ifid/branch/master/graph/badge.svg)](https://codecov.io/gh/furkleindustries/ifid/)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/furkleindustries/big-uuid.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/furkleindustries/big-uuid/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/furkleindustries/big-uuid.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/furkleindustries/big-uuid/context:javascript)

# ifid

## Summary

An Interactive Fiction Identifier (IFID) generating class and helper functions. Implements both RFC 4122 UUIDs (versions 1 and 4), as well as essentially all of the Treaty of Babel, revision 9, as it applies to IFIDs. This package relies on the [big-uuid](https://github.com/furkleindustries/big-uuid) package for its generation of version 1 and version 4 UUIDs.

## Usage notes

* Many of the generation methods utilize MD5. This is for historical compatibility with many aspects of the Treaty of Babel. However, MD5 has since proven to be dangerously inadequate as a hashing algorithm, and extreme caution should be taken by anyone intending to use it to create a permanently unique identifier.
* Generation of version 3 and version 5 UUIDs has been omitted from the IFID generator. If you want to generate these IDs, use [big-uuid](https://github.com/furkleindustries/big-uuid) directly.
