function Template() {
    return (
        /*
        Some html code (has to be contained in one set of tags)
        This will not be accepted:
        <div>
            <p>this is some text</p>
        </div>
        <div>
            <p>this is some more text</p>
        </div>
        */
        <div>
            <p>
                The client is up and running.<br/>
                You can remove the default import and route for the "Template" object inside the file located at this path "./client/src/index.js".<br/>
                You can also remove the file associated with this route located at this path "./client/src/components/Template.js"
            </p>
        </div>
    );
}

export default Template