# SPARQL Property Path Engine

Minimal engine to execture SPARQL property-paths agains ttl/jsonld and a base node.

Implemented with help of https://github.com/RDFLib/rdflib .

## Known issues

- nested `* + ?` selectors might produce duplicates. (e.g. test case pp37)
- negated inverse property paths produce wrong results (e.g. `!^:p`)
