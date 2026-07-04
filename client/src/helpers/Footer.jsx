import "../styles/footer.css";

import { SiReact, SiSpring, SiSpringboot } from "react-icons/si";

export default function Footer() {
	return (
		<footer id="footer">
			<p>
				Built with React App <SiReact /> and Spring <SiSpring /> Boot
				API
				<SiSpringboot />
			</p>
		</footer>
	);
}
