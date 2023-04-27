import re

# open the files
inFile = open('Dictionary.json', 'r')  # open the file we are going to read from
outFile = open('Bulk insert command.json', 'w') # open a new file called 'Bulk insert command.json' for writing the our formatted data to

outFile.write("[")

while True:
    currLine = inFile.readline()
    if(len(currLine) == 0):
        break

    # find the word incased inside the "" if it exists
    word = re.findall('"(.*)"', currLine)  # this reg expression was found here https://note.nkmk.me/en/python-str-extract/
    word = word[0] if len(word) != 0 else word

    if (len(word) != 0):
        # print(f"Adding '{{Word: {word}}},' to the file")
        outFile.write(f'\t{{"Word": "{word}"}},\n'.encode("utf-8").decode("unicode_escape"))
    else:
        # print(f"adding 'newline' to the file")
        outFile.write('\n'.encode("utf-8").decode("unicode_escape"))

outFile.write("]")


# close the files
inFile.close()
outFile.close()  